const products = [

{
    name: "mBot",
    price: "₹6,499",
    image: "demo_images/mbot2.png",
    age: "Age 8+",
    description: "Programmable robot kit for beginners.",
    link: "mbot.html"
},

{
    name: "mBot Ranger",
    price: "₹8,999",
    image: "demo_images/mbot2.png",
    age: "Age 10+",
    description: "Advanced STEM robotics learning platform.",
    link: "ranger.html"
},

{
    name: "mBot Ultimate",
    price: "₹12,999",
    image: "demo_images/mbot2.png",
    age: "Age 12+",
    description: "Professional robotics kit with sensors.",
    link: "ultimate.html"
},

{
    name: "AI Vision Kit",
    price: "₹14,999",
    image: "demo_images/mbot2.png",
    age: "Age 14+",
    description: "Artificial intelligence and vision projects.",
    link: "vision-kit.html"
}


];

const grid = document.getElementById("productsGrid");

function renderProducts(){

    grid.innerHTML = products.map(product => `

        <div class="product-card">

            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-content">

                <div class="product-title">
                    <h3>${product.name}</h3>
                    <span class="price">${product.price}</span>
                </div>

                <p>${product.description}</p>

                <span class="product-age">
                    ${product.age}
                </span>

                <div class="card-buttons">

                    <a href="${product.link}"
                       class="learn-btn">
                        Learn More
                    </a>

                    <a href="${product.link}"
                       class="buy-btn">
                        Buy Now
                    </a>

                </div>

            </div>

        </div>

    `).join('');

}

renderProducts();

/* FILTER BUTTON ACTIVE STATE */

document
.querySelectorAll('.product-filters button')
.forEach(button => {

    button.addEventListener('click', function(){

        document
        .querySelectorAll('.product-filters button')
        .forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');

        const selectedAge =
            this.getAttribute('data-age');

        if(selectedAge === 'all'){
            renderProducts();
            return;
        }

        const filteredProducts =
            products.filter(product =>
                product.age === selectedAge
            );

        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">

                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="product-content">

                    <div class="product-title">
                        <h3>${product.name}</h3>
                        <span class="price">${product.price}</span>
                    </div>

                    <p>${product.description}</p>

                    <span class="product-age">
                        ${product.age}
                    </span>

                    <div class="card-buttons">
                        <a href="${product.link}" class="learn-btn">
                            Learn More
                        </a>

                        <a href="${product.link}" class="buy-btn">
                            Buy Now
                        </a>
                    </div>

                </div>

            </div>
        `).join('');

    });

});