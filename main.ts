import {
	MarkdownView,
	Notice,
	Plugin,
	TFile,
} from "obsidian";

const HEADER_REGEX = /^#\s.+/g;

const isMarkdown = (view: MarkdownView | null): view is MarkdownView => view?.file.extension === 'md';

const stripFileExtension = (fileName: string): string => fileName.replace(/\.[^\.]+$/, '');

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export default class AutoMOC extends Plugin {
	async onload() {
		this.addCommand({
			id: "add-missing-linked-mentions",
			name: "Add missing linked mentions",
			editorCallback: () => this.runAutoMOC(),
		});
	}

	runAutoMOC() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!isMarkdown(view)) return new Notice("Failed to link mentions, file type is not a markdown file");

		new Notice("Linking mentions");
		const missingLinks = this.getMissingLinks(view.file.path);
		this.addMissingLinks(view.file.name, missingLinks);
	}

	getMissingLinks(currentFilePath: string): string[] {
		const allFiles = this.app.metadataCache.resolvedLinks;
		const presentLinks = Object.keys(allFiles[currentFilePath] || {}).sort();
		const linkMentions = Object.keys(allFiles).filter(key => currentFilePath in allFiles[key]).sort().reverse();
		return linkMentions.filter(link => !presentLinks.includes(link));
	}

	async addMissingLinks(currentFileName: string, missingLinks: string[]) {
		let addedAnyLink = false;

		for (const path of missingLinks) {
			const file = this.app.vault.getAbstractFileByPath(path) as TFile;
			const headerLinkLocations = await this.getActiveFileLocationsInOtherFile(currentFileName, path);

			if (headerLinkLocations.length) {
				await this.insertLinksToEditor(file, headerLinkLocations)
				addedAnyLink = true
			}
		}

		if (!addedAnyLink) new Notice("No new links found");
	}

	async getActiveFileLocationsInOtherFile(currentFileName: string, filePath: string): Promise<{ start: number, text: string }[]> {
		const fileLines = await this.getFileLines(filePath);
		return fileLines.map((line, index) => {
			const match = new RegExp(`^# \\[\\[${escapeRegExp(stripFileExtension(currentFileName))}(\\|.+)?\\]\\]$`).exec(line)
			return match ? {start: index, text: match[0] } : null;
		}).filter(Boolean) || [];
	}

	async getFileLines(filePath: string): Promise<string[]> {
		const file = this.app.vault.getAbstractFileByPath(filePath) as TFile;
		const fileContent =  file ? await this.app.vault.read(file) : null;
		return fileContent?.split("\n") || [];
	}

	async insertLinksToEditor(file: TFile, headings: { start: number, text: string }[]) {
		const fileLines = await this.getFileLines(file.path);

		for (const heading of headings) {
			let contentToInsert = "# [[" + stripFileExtension(file.name) + "]]\n";

			let lineIndex = heading.start + 1;
			while (lineIndex < fileLines.length && !fileLines[lineIndex].match(HEADER_REGEX)) {
				contentToInsert += fileLines[lineIndex] + "\n";
				lineIndex++;
			}

			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			view.editor.replaceSelection(contentToInsert);
		}
	}
}
