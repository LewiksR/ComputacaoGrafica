textureLoader = {
    textures: [],
    Load: function (textures) {
        let loader = new THREE.TextureLoader();

        for (let i = 0; i < textures.length; i++) {
            loader.load(
                "textures/" + textures[i],
                function (texture) {
                    textureLoader.textures.push(texture);
                },
                undefined,
                function (error) {
                    console.error(error);
                }
            );
        }
    }
}
