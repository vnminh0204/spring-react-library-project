export async function base64ConversionForImages(e: any, setSelectedImage: any) {
    if (e.target.files[0]) {
        getBase64(e.target.files[0], setSelectedImage);
    }
}

export function getBase64(file: any, setSelectedImage: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        setSelectedImage(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error', error);
    }
}