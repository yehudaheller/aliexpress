// Function to read Excel file
function readExcelFile() {
    return new Promise((resolve, reject) => {
        const url = 'S090ecad3d0094376bde5be9a889eb9ad6.xls'; // Path to the XLS file
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = new Uint8Array(xhr.response);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const products = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                resolve(products);
            } else {
                reject(new Error('Failed to load XLS file'));
            }
        };

        xhr.onerror = function() {
            reject(new Error('Failed to load XLS file'));
        };

        xhr.send();
    });
}

// Function to display products
function displayProducts(products) {
    const container = document.getElementById("product-container");
    container.innerHTML = ""; // Clear previous content
    
    // Skip header row (assuming the first row contains headers)
    for (let i = 1; i < products.length; i++) {
        const product = products[i];
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <h3>${product[2]}</h3>
            <img src="${product[1]}" alt="${product[2]}">
            <p class="product-description">${product[4]}</p>
            <p class="product-price">Price: ${product[5]}</p>
            <p class="discount-price">Discount Price: ${product[6]}</p>
            <!-- Add more details as needed -->
        `;
        container.appendChild(productDiv);
    }
}

// Load and display products when the page loads
window.onload = async function() {
    try {
        const products = await readExcelFile();
        displayProducts(products);
    } catch (error) {
        console.error('Error reading Excel file:', error);
    }
};
