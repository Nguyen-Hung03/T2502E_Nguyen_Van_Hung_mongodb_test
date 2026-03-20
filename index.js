const { connectDB, client } = require('./config/db');

async function main() {
    const db = await connectDB();
    const collection = db.collection('OrderCollection');

    try {
        // 2. Insert many documents
        const sampleData = [
            {
                "orderid": 1,
                "products": [
                    { "product_id": "quanau", "product_name": "quan au", "size": "XL", "price": 10, "quantity": 1 },
                    { "product_id": "somi", "product_name": "ao so mi", "size": "XL", "price": 10.5, "quantity": 2 }
                ],
                "total_amount": 31,
                "delivery_address": "Hanoi"
            },
            {
                "orderid": 2,
                "products": [
                    { "product_id": "giay", "product_name": "giay the thao", "size": "42", "price": 50, "quantity": 1 }
                ],
                "total_amount": 50,
                "delivery_address": "Da Nang"
            }
        ];
        await collection.insertMany(sampleData);
        console.log("2. Đã chèn dữ liệu mẫu.");

        // 3. Edit delivery_address by orderid (Ví dụ: orderid 1)
        await collection.updateOne(
            { orderid: 1 }, 
            { $set: { delivery_address: "Ho Chi Minh City" } }
        );
        console.log("3. Đã sửa địa chỉ orderid 1.");

        // 4. Remove an order (Ví dụ: xóa orderid 2)
        await collection.deleteOne({ orderid: 2 });
        console.log("4. Đã xóa orderid 2.");

        // 5. Read all order in OrderCollection
        const allOrders = await collection.find({}).toArray();
        console.log("5. Danh sách đơn hàng còn lại:");
        console.dir(allOrders, { depth: null });

        // 6. Calculate total amount (Tính tổng tất cả các hóa đơn trong collection)
        const totalAggr = await collection.aggregate([
            { $group: { _id: null, grandTotal: { $sum: "$total_amount" } } }
        ]).toArray();
        const grandTotal = totalAggr.length > 0 ? totalAggr[0].grandTotal : 0;
        console.log(`6. Tổng giá trị tất cả đơn hàng (Total Amount): ${grandTotal}`);

        // 7. Count total product_id equal "somi" and show to screen
        // Cách này đếm số lượng đơn hàng có chứa "somi"
        const countSomi = await collection.countDocuments({ "products.product_id": "somi" });
        console.log(`7. Số lượng đơn hàng có chứa sản phẩm "somi": ${countSomi}`);
        
    } catch (err) {
        console.error("Lỗi thực thi:", err);
    } finally {
        // Đóng kết nối sau khi xong việc
        await client.close();
        console.log(">>> Đã đóng kết nối.");
    }
}

main();