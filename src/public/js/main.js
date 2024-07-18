const socket = io();

socket.on('productos', (data) => {
    renderProductos(data);
});

const renderProductos = (data) => {
    const contenedorProductos = document.getElementById('contenedorProductos');
    contenedorProductos.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
        <img class="card-img" src="${item.thumbnail}" alt="${item.title}">
        <h3 class="title">Title: ${item.title}</h3>
        <p class="sub-info">Price: ${item.price}</p>
        <p class="sub-info">ID: ${item._id}</p>
            <button class="delete-btn">Eliminar</button>
        `;
        contenedorProductos.appendChild(card);

        card.querySelector('.delete-btn').addEventListener('click', () => {
            console.log(`Attempting to delete product with ID: ${item._id}`);
            eliminarProducto(item._id);
        });
    });
};

const eliminarProducto = (id) => {
    socket.emit('eliminarProducto', id, (response) => {
        if (response.success) {
            console.log(`Producto con ID ${id} eliminado`);
        } else {
            console.error(`Error al eliminar el producto: ${response.message}`);
        }
    });
};

document.getElementById('btnEnviar').addEventListener('click', () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        img: document.getElementById('img').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        status: document.getElementById('status').value === 'true',
    };

    socket.emit('agregarProducto', producto, (response) => {
        if (response.success) {
            console.log('Producto agregado con éxito');
        } else {
            console.error(`Error al agregar el producto: ${response.message}`);
        }
    });
};
