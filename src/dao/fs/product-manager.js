import { promises as fs } from "fs";

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            const arrayProductos = await this.leerArchivo();

            if (!title || !description || !price || !code || !stock || !category) {
                console.log("All fields are required");
                return;
            }

            if (arrayProductos.some(item => item.code === code)) {
                console.log("Code must be unique");
                return;
            }

            const newProduct = {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            };

            if (arrayProductos.length > 0) {
                ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            newProduct.id = ++ProductManager.ultId;

            arrayProductos.push(newProduct);
            await this.guardarArchivo(arrayProductos);
        } catch (error) {
            console.log("Error adding the product", error);
            throw error;
        }
    }
    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo();
            return arrayProductos;
        } catch (error) {
            console.log("Error reading the file", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Product not found");
                return null;
            } else {
                console.log("Product found");
                return buscado;
            }
        } catch (error) {
            console.log("Error reading the file", error);
            throw error;
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.log("Error reading the file", error);
            throw error;
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error saving the file", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
                await this.guardarArchivo(arrayProductos);
                console.log("Product updated");
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.log("Error updating the product", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Product eliminated");
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.log("Error eliminating the product", error);
            throw error;
        }
    }
}

export default ProductManager;
