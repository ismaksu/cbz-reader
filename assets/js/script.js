window.onload = function () {
  const cbzFileInput = document.getElementById("cbzFile");
  const imageContainer = document.getElementById("imgContainer");
  let pages = [];

  async function decompressPages(cbzFile) {
    try {
      JSZip.loadAsync(cbzFile)
        .then(async (cbz) => {
          const cbzContent = Object.keys(cbz.files).filter((file) =>
            file.endsWith(".webp")
          );
          console.log(cbzContent.length);
          if (cbzContent.length > 1) {
            for (const file of cbzContent) {
              const page = cbz.files[file];
              const blob = await page.async("blob");
              const imageUrl = URL.createObjectURL(blob);
              pages.push({
                pageNumber: file.slice(0, -4),
                blobUrl: imageUrl,
              });
            }
            pages.sort((a, b) => a.pageNumber - b.pageNumber);
            viewPages();
          } else {
            console.log('No webp files found in the CBZ file.');
          }
        });
    } catch (error) {
      console.error("Error loading cbz: ", error);
    }
  }

  function viewPages() {
    console.log(pages);
    pages.forEach(page => {
      const img = document.createElement('img');
      img.src = page.blobUrl;
      img.className = 'pageImage';
      imageContainer.appendChild(img);
    });
  }

  cbzFileInput.addEventListener("change", (event) => {
    const cbzFile = event.target.files[0];
    decompressPages(cbzFile);
  });
};