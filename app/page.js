'use client'
import React, {useState, useEffect} from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  querySnapshot, 
  onSnapshot, 
  query,
  deleteDoc,
  doc,
} from "firebase/firestore"; 
import {db} from './firebase'

export default function Home() {
  const [items, setItems] = useState([
    // {name: 'Coffee', price: 4.95},
    // {name: 'Movie', price: 24.95},
    // {name: 'candy', price: 7.95},
  ])
  const [newItem, setNewItem] = useState({name: '', price: '', amount: ''});
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Add item to database
  const addItems = async (e) => {
    //stops the form from submitting the usual way, allowing you to handle the form submission in your own way, typically via JavaScript.
    e.preventDefault()
    if (newItem !== '' && newItem.price !== '') {
      // setItems([...items, newItem])
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
        amount: newItem.amount,
      });
      setNewItem({name: '', price: '', amount: ''});
    }
  }

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []

      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id})
      });
      setItems(itemsArr)
      
      
      //Read total from items array
      const calculateTotal = () => {
        //sum is the variable holding the total, item is the price of an item being lookied at
        //0 is the intial value of sum
        const totalPrice = itemsArr.reduce((sum, item) => sum + (parseFloat(item.price) * parseFloat(item.amount)), 0)
        setTotal(totalPrice)
      }
      calculateTotal()
      return () => unsubscribe();
    });
  }, [])

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  }

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    console.log(event.target.value);  // Add this line to see if input is captured correctly
    setSearchQuery(event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>

        

        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="mb-4 text-black">
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-3 w-full border"
            />
          </div>
          <form className="grid grid-cols-6 items-center text-black">
            <input 
              value={newItem.name}
              //the elpises is called a soread syntax, without it, both price and name would end up solely becoming name (parts of the object are lost)
              onChange={(event) => setNewItem(
                {...newItem, name: event.target.value}
              )}
              className="col-span-3 p-3 border" 
              type="text" 
              placeholder="Enter Item"
            />
            <input 
              value={newItem.price}
              onChange={(event) => setNewItem(
                {...newItem, price: event.target.value}
              )}

              className="col-span-1 p-3 border mx-3" 
              type="number" 
              placeholder='Enter $'
            />
            <input 
              value={newItem.amount}
              onChange={(event) => setNewItem(
                {...newItem, amount: event.target.value}
              )}

              className="col-span-1 p-3 border mx-3" 
              type="number" 
              placeholder='Enter Amount'
            />
            <button 
              onClick={addItems}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" 
              type="submit"
            >
                +
            </button>
          </form>

          <ul>
            {filteredItems.map((item, id) => (
              <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>Amount: {item.amount}</span>
                  <span>${item.price * item.amount}</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">
                  X
                </button>
              </li>
            ))}
          </ul>

          {
            filteredItems.length < 1 ? ('') : (
              <div className="flex justify-between p-3">
                <span>Total</span>
                <span>${total}</span>
              </div>
            )
          }

        </div>
      </div>
    </main>
  );
}
