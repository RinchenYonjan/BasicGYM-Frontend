// import CardComp from "@/components/CardComp";
// import { useEffect, useState } from "react";
// import { FlatList, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

import { Redirect } from "expo-router";

// export default function HomeScreen() {

//   const [products, setProducts] = useState<any>([]);
  
//   const [users, setUsers] = useState<any[]>([]);

//   useEffect(() => {
//     fetch("https://dummyjson.com/products")
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data.products);
//       })
//       .catch((err)=>console.log(err));
//     },[]);
//   // const [value, setValue] = useState (1);
//   // const [result, setResult] = useState <any>();
//   // const [users, setUsers] = useState([
//   //   {
//   //     id: "1",
//   //     name: "Jhon",
//   //     age: "25",
//   //   },
//   //   {
//   //     id: "2",
//   //     name: "Sam",
//   //     age: "30",
//   //   },
//   //   {
//   //     id: "3",
//   //     name: "Peter",
//   //     age: "35",
//   //   },
//   // ]);

//   // function increaseNumber() {
//   //   setValue(value + 1);
//   // }

//   // function decreaseNumber() {
//   //   setValue((preValue) => {
//   //     return preValue - 1;
//   //   });
//   // }

//   // function addition(a: number, b: number) {
//   //   return a + b;
//   // }

//   // function multiplication(c: number, d: number) {
//   //   setResult(c * d);
//   // }

//   async function getUsers(){
//     try {
      
//       const response = await fetch ("https://dummyjson.com/users");
//       const data = await response.json();

//       setUsers(data.users)
//     }catch (err){
//       console.log(err);
//     }
//   }

//   useEffect(() => {
//     getUsers();
//   },[])

//   return (
//     <SafeAreaView>
//       {/* <Text>The increase number is {value}</Text>
//       <Text onPress={increaseNumber}>Press here to increase number</Text>
//       <Text onPress={decreaseNumber}>Press here to decrease number</Text>
//       <Text>The addition of 2 and 3 is {addition(2, 3)}</Text>
//       <Text
//         onPress={() => {
//           multiplication(14, 14);
//         }}
//       >
//         Click here to multiplication of 14*14 is {result}
//       </Text> */}

//       <FlatList 
//       data = {users}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({item}) => {
//         return (
//           <View style = {{padding:10}}>
//             <Text>{item.firstName}</Text>
//             <Text>{item.gender}</Text>
//             <Text>{item.email}</Text>
//             <Text>{item.university}</Text>
//           </View>
//         )
//       }}
//       />

//      <FlatList
//         data={products}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <CardComp
//             title={item.title}
//             price={item.price}
//             url={item.thumbnail} // image from DummyJSON
//           />
//         )}
//       />

//       {/* \
//       <FlatList
//         data={users}
//         renderItem={({ item }) => {
//           return (
//             <View>
//               <Text>{item.name}</Text>
//               <Text>{item.age}</Text>
//             </View>
//           );
//         }}
//       /> */}

//       {/* <FlatList
//       data = {product} /> */}
//     </SafeAreaView>
//   );
// }


export default function Index(){
  return (
    
    <Redirect href="/(auth)/dashboard"/>
  
  )
  
}