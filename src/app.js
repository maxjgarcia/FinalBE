import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import './database.js';
import ProductModel from './dao/fs/data/product.model.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

// Express-Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.get("/", (req, res) => {
    res.render('index');
});

app.get('*', (req, res) => {
    res.status(404).render('404');
});

// Start the server
const httpServer = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('A client connected');

    // Send the array of products from the database
    socket.emit('productos', await ProductModel.find({}));

    // Handle the "eliminarProducto" event from the client
    socket.on('eliminarProducto', async (id, callback) => {
        try {
            console.log(`Attempting to delete product with ID: ${id}`);
            const result = await ProductModel.findByIdAndDelete(id);
            if (result) {
                console.log(`Product with ID: ${id} deleted successfully`);
                const updatedProducts = await ProductModel.find({});
                io.sockets.emit('productos', updatedProducts);
                callback({ success: true });
            } else {
                console.log(`Product with ID: ${id} not found`);
                callback({ success: false, message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            callback({ success: false, message: error.message });
        }
    });

    // Handle adding products through a form
    socket.on('agregarProducto', async (producto, callback) => {
        try {
            await ProductModel.create(producto);
            const updatedProducts = await ProductModel.find({});
            io.sockets.emit('productos', updatedProducts);
            callback({ success: true });
        } catch (error) {
            console.error('Error adding product:', error);
            callback({ success: false, message: error.message });
        }
    });
});
