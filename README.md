# AutoMOC for Obsidian

This plugin automatically imports any linked mentions into the current note that are not already in the note at the current cursor location. <br><br>
When taking notes, one may forget to provide the backlink to the MOC for which a new note was linked. Over time this leads to many purely directional links. MOCs may miss many notes they are linked to purely by the user forgetting. <br><br>
This resolves that issue by checking for missing linked mentions and adding them to the current note at the current cursor location.
<br>

## Usage

After enabling this plugin, place your cursor in an editable note where you want the links to be added. <br>
Run the plugin either through the command pallette, keyboard shortcut (must be mapped), or ribbon button.
<br>

![demo](assets/auto-moc-demo.gif)
<br>
<br>
There is an option to disable the ribbon button being added in the plugin settings. The plugin can still be activated by using the command pallete or by using a mapped hotkey.

## Known issues

1. This plugin requires that you enable the core backlink plugin and turn on the "Backlink in document" setting for the plugin.
    - The plugin uses this backlink pane to find the linked mentions.
      ![backlink-pane](assets/backlink-pane.png)
2. The backlink pane only renders up to 13 notes at a time by default. That means any notes below 13 will not be seen by the plugin and may not be added.
   To get around this, first place the cursor in the note where you would link the links to be added. Then scroll all the way to the bottom of the backlink pane, then run the plugin either through a keyboard shortcut or the ribbon icon. <br>
    - This is, unfortunately, a necessary evil as the Obsidian API does not explicitly expose the backlinks, so the links have to be gathered from the raw UI. I will be suggesting this as an improvement to the plugin API.
3. This plugin does support the use of the Sliding Panes plugin and will put the new links in the currently active note.

## Pricing

This plugin is provided to everyone for free, however if you would like to say thanks or help support continued development, consider getting me a coffee. It keeps my work going.

<a href="https://www.buymeacoffee.com/roniemartinez" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Notes

This plugin has **not** yet been tested on mobile.
<br>
<br>
If you have suggestions on how to make this more user friendly, find bugs, or would like to contribute feel free to submit a pull request.