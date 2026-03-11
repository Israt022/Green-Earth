const treesContainer = document.getElementById('treesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const allTreesButton = document.getElementById('allTreesButton');
const treesDetailModal = document.getElementById('trees_detail_modal');
let cart = [];

const showLoading = () =>{
    loadingSpinner.classList.remove('hidden');
    treesContainer.innerHTML = "";
}
const hideLoading = () =>{
    loadingSpinner.classList.add('hidden');
}


// Category Fetch
const loadCategories = async() =>{
    try {
        loadingSpinner.classList.remove('hidden');
        const res =await fetch("https://openapi.programming-hero.com/api/categories");
        const data = await res.json();
        displayCategories(data.categories);
    } catch(error){
        console.log("Error : ", error);
        
    }
}
// Trees Fetch
const loadTrees = async () => {
    showLoading();
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();
    hideLoading();
    displayTrees(data.plants);
}

loadCategories();
loadTrees();

// Display All Categories
const displayCategories = (categories) =>{
    const categoriesContainer = document.getElementById("categoriesContainer");

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline border-[#15803D] text-[#15803D] w-[80%] md:w-full mx-auto "
        btn.textContent = category.category_name;
        btn.onclick = () => selectCategory(category.id,btn);
        categoriesContainer.appendChild(btn)
    });
}

const selectCategory = async (categoryId,btn) => {
    console.log(categoryId,btn);
    showLoading();
    const allButtons = document.querySelectorAll("#categoriesContainer button,#allTreesButton");
    allButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    });

    btn.classList.add("btn-primary");
    btn.classList.remove("btn-outline"); //"btn bg-[#15803D] text-white btn-active border-none w-full"

    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
    const data = await res.json();
    displayTrees(data.plants);
    hideLoading();
}
allTreesButton.addEventListener("click",()=>{
     const allButtons = document.querySelectorAll("#categoriesContainer button,#allTreesButton");
    allButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    });

    allTreesButton.classList.add("btn-primary","text-[#15803D]");
    allTreesButton.classList.remove("btn-outline");
    loadTrees();
})

// Display All Trees
const displayTrees = (trees) => {
    

    trees.forEach(tree => {
        const card = document.createElement('div');
        card.className = "card bg-white shadow-sm w-[80%] md:w-[95%] mx-auto";
        card.innerHTML = `
            <figure class="overflow-hidden rounded-xl m-3 ">
                <img
                src=${tree.image}
                alt=${tree.name} 
                title=${tree.name} 
                class="h-40 w-full object-cover  cursor-pointer "
                onclick="openTreeModal(${tree.id})"
            />
            </figure>
            <div class="card-body">
                <h2 class="card-title text-[#15803D]" onclick="openTreeModal(${tree.id})">${tree.name}</h2>
                <p class="text-start line-clamp-2 text-black/60">${tree.description}</p>
                <div class="flex flex-wrap lg:justify-around">
                <div class="badge bg-[#b8e6c8] text-[#15803D]">${tree.category}</div>
                    <h2 class="font-bold text-xl text-[#15803D]">$${tree.price}</h2>
                </div>

                <div class="card-actions justify-between items-center">
                    
                    <button onclick="addToCart(${tree.id} , '${tree.name}',${tree.price})" class="btn bg-[#15803D] border-none text-white w-full rounded-full">Add To Cart</button>
                </div>
            </div>
        `
        treesContainer.append(card);

        /**
         <!--<div class=>
            
        </div>
         */
    });
}

const openTreeModal = async(treeId) =>{
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`);
    const data = await res.json();
    const platDetails = data.plants;
    console.log(platDetails);

    document.getElementById("tree_img").src = platDetails.image; 
    document.getElementById("tree_title").textContent = platDetails.name; 
    document.getElementById("tree_cat").textContent = platDetails.category; 
    document.getElementById("tree_des").textContent = platDetails.description; 
    document.getElementById("tree_pp").textContent = platDetails.price; 

    treesDetailModal.showModal();
}

const addToCart = (id,name,price) => {
    console.log(id,name,price);
    const existingItem = cart.find(item => item.id === id)

    if(existingItem){
        existingItem.quantity += 1;
    }
    else{
        cart.push({
            id,name,price,quantity : 1
        });
    }
    
    updateCart();
}

const updateCart = () => {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const totalPrice = document.getElementById('totalPrice');
    
    cartContainer.innerHTML = "";

    if(cart.length === 0){
        emptyCartMessage.classList.remove('hidden');
        totalPrice.textContent = `$0`;
        return
    }
    emptyCartMessage.classList.add('hidden');

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.classList = "card card-body shadow-lg shadow-[#d0e6d6] bg-[#F0FDF4]";
        div.innerHTML = `
            <div class= "flex justify-between items-center">

                <div>
                    <h2 class="font-semibold text-base">${item.name}</h2>
                    <p class="text-gray-500">$${item.price} x ${item.quantity}</p>
                </div>
                <button class="btn btn-ghost" onclick="removeFromCart(${item.id})">X</button>
            </div>
            <p class="text-right font-semibold text-xl">$${item.price * item.quantity}</p>
        `
        cartContainer.appendChild(div)
    })
    totalPrice.innerText =`$ ${total}`;
}

const removeFromCart = (treeId) => {
    console.log(treeId);
    const updatedCart = cart.filter(item => item.id != treeId);
    console.log(updatedCart);
    cart = updatedCart;
    updateCart();
}