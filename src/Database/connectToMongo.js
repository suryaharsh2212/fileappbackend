import mongoose from "mongoose";

async function ConnectToMongo()
{
    try {
        const connection= await mongoose.connect(`${process.env.DATABASE_URL}`)
        console.log(`Database connected sucessfully ..............`)
    } catch (error) {
        console.log("Some error occured during conntecting..............",error.message);
    }
}
export default ConnectToMongo;
