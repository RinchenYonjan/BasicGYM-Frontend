import axios from "axios";
const url = "http://192.168.100.170:3000/api/auth/login-user"

export const loginUser = async(email:string,password:string)=>{
    try{
        console.log("this is email",email);
        console.log("This is password",password)

        const response = await axios.post(url,{
            email:email,
            password:password
        })

        // console.log("this is response",response.data);
        return response.data;

    }
    catch(err:any){
        console.log("this is error",err);

    }

}