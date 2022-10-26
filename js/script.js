const soup1 = "011110038364";
let productImg, productName;
const baseURL = "https://world.openfoodfacts.org/api/v0/product/" // URL
window.onload = () => {
    console.log("Window loaded");
    const vegForm = document.getElementById("isVegetarian");
    vegForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let barcode = document.getElementById("UPC_barcode").value;
        let item = retrieveBarcode(barcode)
        // alert(v)
        //.then( v => {
        //    document.querySelector(".result").innerText = v ? "Yes, it's vegetarian" : "No, it's not vegetarian"
        //}
       // );
        
    } )
    productImg = document.getElementById('product-img')
    productImg.classList.add('hidden');
    productName = document.getElementById('product-name');
    productName.classList.add('hidden');

}

async function retrieveBarcode(barcode)
{
    const url = baseURL + barcode + ".json";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.status === 1) {
                // call additional stuff
                let item = new ProductInfo(data.product);
                item.showInfo();
                return item;
                

            } else if (data.status === 0 ) {
                alert(`Product ${barcode} not found. Please try another.`);
                return null;
            }

        })
        .catch(err => {
            console.log(`Error: ${err}`)
            return null;
        })

}
class ProductInfo {
    // this constructor takes data.product
    constructor(productData) {
        this.name = productData.product_name;
        this.ingredients = productData.ingredients;
        this.image = productData.image_url;
    }
    showInfo() {
        productImg.src = this.image;
        productImg.classList.remove('hidden');
        productName.innerText = this.name;
        productName.classList.remove('hidden');
        this.showIngredients();
    }
    showIngredients() {
        let ingredientTable = document.getElementById('product-ingredients');
        // clear the table
        for(let i = 1; i < ingredientTable.rows.length;) {
            ingredientTable.deleteRow(i);
        }

        let ingredients = [...this.ingredients];
        console.log(ingredients);
        if(ingredients !== null) {
            // fill the table with ingredients.
            ingredients.forEach(ingredient => {
                let newRow = ingredientTable.insertRow(-1);
                let newICell = newRow.insertCell(0);
                let newVCell = newRow.insertCell(1);
                console.log(ingredient);
                let newIText = document.createTextNode(
                    ingredient.text
                );
                let isVeg = ingredient.vegetarian ? ingredient.vegetarian: 'unknown';
                let newVText = document.createTextNode(
                    isVeg
                );
                newICell.appendChild(newIText);
                newVCell.appendChild(newVText);
                if(isVeg === "no") {
                    newVCell.classList.add("non-veg-item");
                } else if (isVeg === "unknown" || isVeg === "maybe") {
                    newVCell.classList.add("unknown-veg-item");
                }
                // cell1.innerText = ingredient.text;
                // cell2.innerText = ingredient.vegetarian ? ingredient.vegetarian: 'no';
                
            })
        }
    }

    isVegetarian() {
        // if any ingredient is not vegetarian, then the product is not vegetarian. 
        [...this.ingredients].forEach(ingredient => {
            if(ingredient.vegetarian === "no") {
                return false;
            }
        })
        return true;
    }
    testCall() {
        [...this.ingredients].forEach(ingredient => {
            console.log(ingredient);
        })
    }
}