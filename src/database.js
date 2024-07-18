import mongoose from "mongoose";

mongoose.connect("mongodb+srv://garmax:lapasscode@ecommerce.pq7kdif.mongodb.net/ecommerce")
    .then(() => console.log("Conected!"))
    .catch((error) => console.log("Connection error", error))
