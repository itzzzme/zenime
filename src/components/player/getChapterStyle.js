export default function getChapterStyles(intro, outro) {
  let styles = `
        .art-chapters {
            gap: 0px !important;
        }
    `;

  if (intro && outro) {
    if (
      intro.start === 0 &&
      intro.end === 0 &&
      outro.start === 0 &&
      outro.end === 0
    ) {
      styles += ``;
    } else if (
      intro.start === 0 &&
      intro.end === 0 &&
      outro.start !== 0 &&
      outro.end !== 0
    ) {
      styles += `
                .art-chapter:nth-child(2) {
                    background-color: #fdd253;
                    transform: scaleY(0.6);
                }
            `;
    } else if (
      intro.start === 0 &&
      intro.end !== 0 &&
      outro.start === 0 &&
      outro.end === 0
    ) {
      styles += `
                .art-chapter:nth-child(1){
                    background-color: #fdd253;
                    transform: scaleY(0.6);
                }
            `;
    } else if (
      intro.start === 0 &&
      intro.end !== 0 &&
      outro.start !== 0 &&
      outro.end !== 0
    ) {
      styles += `
                .art-chapter:nth-child(1), 
                .art-chapter:nth-child(3) {
                    background-color: #fdd253;
                    transform: scaleY(0.6);
                }
            `;
    } else if (
      intro.start !== 0 &&
      intro.end !== 0 &&
      outro.start === 0 &&
      outro.end === 0
    ) {
      styles += `
                .art-chapter:nth-child(2) {
                    background-color: #fdd253;
                    transform: scaleY(0.6);
                }
            `;
    } else if (
      intro.start !== 0 &&
      intro.end !== 0 &&
      outro.start !== 0 &&
      outro.end !== 0
    ) {
      styles += `
                .art-chapter:nth-child(2),
                .art-chapter:nth-child(4) {
                    background-color: #fdd253;
                    transform: scaleY(0.6);
                }
            `;
    }
  }

  return styles;
}
