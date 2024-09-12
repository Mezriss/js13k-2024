const logoW =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAALAgMAAADdKT/PAAAACVBMVEUAAAD/Y0f///+/SAkHAAAAOElEQVQIHQXBQQ0AMQwDwZVfB6PKqzpABWUAhWBFQdkZcrS4MeR6kUyTM83MNJLgL29K/qjyRmUe+zIPu2igVewAAAAASUVORK5CYII=";

const logoB =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAALAgMAAADdKT/PAAAACVBMVEUAAAD/Y0f///+/SAkHAAAAMUlEQVQIHQXBMQEAMAwCwR+QEAGIiqCMyOiIzN6hbRi5aBwkQAsA0LZcfKR+JD4a9wMmog1pn54GhQAAAABJRU5ErkJggg==";

export const readImage = async (img) => {
  const image = new Image();

  const onImageLoad = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const colorArray = [];
    for (let y = 0; y < canvas.height; y++) {
      const row = [];
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const color = [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3] / 255];
        row.push(color);
      }
      colorArray.push(row);
    }

    return colorArray;
  };

  image.src = img;
  await new Promise((res, rej) => {
    image.onload = res;
    image.onerror = rej;
  });
  return onImageLoad();
};
