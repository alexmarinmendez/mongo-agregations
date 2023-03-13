import mongoose from "mongoose"
import orderModel from "./models/order.model.js"

const main= async() => {
    await mongoose.connect('mongodb://127.0.0.1:27017', {
        dbName: "pizzacoder"
    })
    console.log('BD connected!')

    // const result = await orderModel.insertMany(
    //     [
    //         {name: 'Pepperoni', size: 'small', price: 19, qty: 10 },
            // {name: 'Pepperoni', size: 'medium', price: 20, qty: 20 },
    //         {name: 'Pepperoni', size: 'large', price: 21, qty: 30 },
    //         {name: 'Cheese', size: 'small', price: 12, qty: 15 },
    //         {name: 'Cheese', size: 'medium', price: 13, qty: 50 },
    //         {name: 'Cheese', size: 'large', price: 14, qty: 10 },
    //         {name: 'Hawaina', size: 'small', price: 17, qty: 10 },
    //         {name: 'Hawaina', size: 'medium', price: 18, qty: 10 },
    //     ]
    // )

    // console.log(result)
    
    const orders = await orderModel.aggregate([
        {$match: { size: "medium" }},
        {
            $group: {
                _id: "$name",
                totalQty: { $sum: "$qty" }
            }
        },
        { $sort: {totalQty: -1} },
        { $group: {
            _id: 1,
            orders: { $push: "$$ROOT"}
        }},
        {
            $project: {
                "_id": 0, //genera un ObjectId
                orders: '$orders'
            }
        },
        { $merge: {into: 'reports'} }
    ])
    
    console.log(orders)
    process.exit()
}

main()