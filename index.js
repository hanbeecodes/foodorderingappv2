






import {menuArray} from "./data.js"
import {makeId} from "./functions.js"
const menuDisplay = document.getElementById("menu-display")
const orderedItemsDisplay = document.getElementById("ordered-items-display")
const totalPriceDisplay = document.getElementById("total-price-display")
const yourOrderHeader = document.getElementById("your-order-header")
const completeOrderBtn = document.getElementById("complete-order-button")
const modal = document.getElementById("modal")
const paymentDetailsForm = document.getElementById("payment-details-form")
const thankyouMessage = document.getElementById("thankyou-message")

let itemsOrderedArr = []
let totalPrice = 0
     
//class constructor for ordered item objects
class orderedItem {
    constructor(name, price, newId){
        this.name = name
        this.price = price
        this.newId = newId
    }
}

//1. Render the menu on the page      
menuArray.forEach((menuItem) =>
    menuDisplay.innerHTML += `
                            <div class="menu-item"> 
                                <div class="flexbox1">
                                    <div class="item-emoji">${menuItem.emoji}</div>
                                    <div class="item-details">
                                        <div class="item-name">${menuItem.name}</div>
                                        <div class="ingredients-list">${menuItem.ingredients.join(', ')}</div>
                                        <div class="item-price">£${menuItem.price}</div>
                                        </div>
                                </div>
                                <button type="button" class="order-item-button" id="${menuItem.id}">+</button></div>
                            </div>
                            <hr class="separating-line">
                            `
)


// 2. Listen for clicks on menu item buttons. On each button click of a menu item, it will re-render the orderedItemsArr array in the orderedItemsDisplay

menuDisplay.addEventListener("click", function(event){
    //If statement to make sure clicks register on button press only 
    if(event.target.type==="button"){
        const result = menuArray.find(({id}) => id === Number(event.target.id) )
        //call make id function and save it to a const
        const uid = makeId(5)
        //call the class constructor to create a new object for the new ordered item, including the newly create uid. Save this new object to a const.
        const newOrderedItem = new orderedItem(result.name, result.price, uid)
        //Add the new object created to itemsOrderedArr, to create an array of the ordered items.
        itemsOrderedArr.push(newOrderedItem)
        //If there is anything in the ordered items array, sall the renderOrderedItems function, which will render items from the itemsOrderedArr into the ordered items display on the page, including clearing out the display first each time a change is made to the array (function is called renderOrderedItems)
        if(itemsOrderedArr.length > 0){
            yourOrderHeader.innerHTML = `
                            <h2>Your Order</h2>
                            `
            renderOrderedItems()
        }
        //below calls on the function calculateTotalPrice to calculate the total
        calculateTotalPrice(itemsOrderedArr)
        renderTotalPrice(itemsOrderedArr)
        }
    })


//remove button functionality...
orderedItemsDisplay.addEventListener("click", function(event){
    if(event.target.type==="button"){
        itemsOrderedArr.forEach((item) =>{
            //Look the clicked item up by ID in the array and splice to remove that item
            if(event.target.id === item.newId){
                const targetId = item.newId
                const itemIndex = itemsOrderedArr.findIndex(function(itemLookup){
                    return itemLookup.newId === targetId
                    })
                //Remove the item with the correct id from the array
                itemsOrderedArr.splice(itemIndex, 1)
                //If the array has been emptied out, change the header to say the order is empty
                if(itemsOrderedArr.length < 1){
                    yourOrderHeader.innerHTML = `
                            Your Order is Empty
                            `
                }
                //re-render the array onto the page
                renderOrderedItems(itemsOrderedArr)
                //Here it will need to make sure totalPrice is updated and re-rendered as well
                calculateTotalPrice(itemsOrderedArr)
                renderTotalPrice(itemsOrderedArr)
            }
        })
    }
})

//CARD DETAILS POPUP
//on the click of the complete order button, the modal popup needs to appear as a popup
//The modal popup is written into the html. 
//On the click of the "Pay" button it needs to disappear and the message "Thanks ${name}! Your order is on its way!" needs to show.
completeOrderBtn.addEventListener("click", function(event){
    //below makes the payment modal visible on the click of the complete order button
    modal.style.display = 'flex'
    paymentDetailsSubmitFunction()
})


//TROUBLESHOOTING

//Would be good to add a functionality where if you click off from the popup it closes the popup so you can decide to add or remove from the order.
//to do this i would need to put a click handler on the window 



//FUNCTIONS

//function to render out ordered items into the ordered items display section of the page
function renderOrderedItems(item){
            orderedItemsDisplay.innerHTML = ""
            thankyouMessage.style.display = "none"
            completeOrderBtn.style.display = "flex"
            itemsOrderedArr.forEach((item) => {
                orderedItemsDisplay.innerHTML += `
                            <div id="items-list">   
                                <div class="ordered-item-name-display">${item.name} <button type="button" class="remove-item-btn" id="${item.newId}">remove</button> </div>
                                <div class="ordered-item-price-display">£${item.price}</div>
                            </div> 
                            `
                })    
            if(itemsOrderedArr.length > 0){
                completeOrderBtn.innerHTML = `<button type="button" class="complete-order-button" id="complete-order-styling">Complete order</button>`
            }
}

//function below will total up the prices of what is being ordered from the itemsOrderedArray, producing a totalPrice
function calculateTotalPrice(){
            totalPrice = itemsOrderedArr.reduce(function(total, currentItem){
            return total + currentItem.price
            },0)
        return totalPrice
}

//function below render the total price out freshly
function renderTotalPrice(){
    totalPriceDisplay.innerHTML= `<hr id="border-before-total-price">
                                    <div id="total-price-display-inner">
                                        <div id="price-display-left">Total Price:</div>
                                        <div id="price-display-right">£${totalPrice}</div>
                                    </div>
                                     `
}

function paymentDetailsSubmitFunction(){
    paymentDetailsForm.addEventListener("submit", function(event){
        event.preventDefault()
        modal.style.display = "none"
        const paymentDetailsFormData = new FormData(paymentDetailsForm)
        const nameFromForm = paymentDetailsFormData.get("cardholder-name")
        yourOrderHeader.style.display = "none"
        orderedItemsDisplay.innerHTML = ""
        totalPriceDisplay.innerHTML = ""
        thankyouMessage.innerHTML = ""
        completeOrderBtn.style.display = "none"
        thankyouMessage.style.display = "block"
        thankyouMessage.innerHTML = `<p>Thanks ${nameFromForm}! Your order is on its way!</p>`
        paymentDetailsForm.reset()
        itemsOrderedArr = []
        // cardholderName.value = ""
        //need to find something here which clears out the fields in the payment form 
    })
    
}

