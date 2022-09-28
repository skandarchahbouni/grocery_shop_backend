const group_response = (array) => {
    const photos = []
    array.forEach(obj => {
        photos.push(obj.lien_photo)
    });
    const object = array[0]
    delete object.lien_photo
    object.photos = photos
    return object
}

module.exports = group_response