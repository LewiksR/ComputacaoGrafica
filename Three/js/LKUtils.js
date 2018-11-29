LKUtils = {
    textureLoader: {
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
    },
    math: {
        VectorProduct: function (vectorA, vectorB) {
            return [
                (vectorB[1] * vectorA[2]) - (vectorB[2] * vectorA[1]),
                (vectorB[2] * vectorA[0]) - (vectorB[0] * vectorA[2]),
                (vectorB[0] * vectorA[1]) - (vectorB[1] * vectorA[0])
            ];
        },
        UnitVector: function (vector) {
            let length = Math.sqrt( Math.pow( vector[0], 2 ) + Math.pow( vector[1], 2 ) + Math.pow( vector[2], 2 ) );

            return [
                vector[0] / length,
                vector[1] / length,
                vector[2] / length
            ];
        }
    }
};
