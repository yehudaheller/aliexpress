<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Catalog</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
</head>
<body>
    <div id="product-container"></div>

    <script>
        // Function to read Excel file
        function readExcelFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const products = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    resolve(products);
                };

                reader.onerror = function(error) {
                    reject(error);
                };

                reader.readAsArrayBuffer(file);
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
                productDiv.innerHTML = `
                    <h3>${product[2]}</h3>
                    <p>${product[4]}</p>
                    <p>Price: ${product[5]}</p>
                    <p>Discount Price: ${product[6]}</p>
                    <!-- Add more details as needed -->
                `;
                container.appendChild(productDiv);
            }
        }

        // Handle file input change event
        document.getElementById('file-input').addEventListener('change', async function(event) {
            const file = event.target.files[0];
            try {
                const products = await readExcelFile(file);
                displayProducts(products);
            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        });
    </script>

    <input type="file" id="file-input" accept=".xls">
</body>
</html>
