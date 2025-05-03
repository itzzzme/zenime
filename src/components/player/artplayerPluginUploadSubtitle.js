import { uploadIcon } from "./PlayerIcons";

export default function artplayerPluginUploadSubtitle() {
  return (art) => {
    const { getExt } = art.constructor.utils;

    art.setting.add({
      html: `
        <div class="subtitle-upload-wrapper" style="position: relative;">
          <input 
            type="file" 
            name="subtitle-upload" 
            id="subtitle-upload" 
            style="display: none;" 
          />
          <label 
            for="subtitle-upload" 
            class="subtitle-upload-label"
            style="cursor: pointer; user-select: none;"
          >
            Upload Subtitle
          </label>
        </div>
      `,
      icon: uploadIcon,
      onClick(setting, $setting) {
        const $input = $setting.querySelector("input[name='subtitle-upload']");
        const $label = $setting.querySelector(".subtitle-upload-label");

        art.proxy($input, "change", (event) => {
          const file = event.target?.files?.[0];
          if (!file) return;

          const url = URL.createObjectURL(file);
          art.subtitle.switch(url, {
            type: getExt(file.name),
          });

          event.target.value = null;

          // Update UI
          $label.textContent = file.name;
          art.notice.show = `Upload Subtitle ：${file.name}`;
          setting.tooltip = file.name;
        });
      },
    });
  };
}
