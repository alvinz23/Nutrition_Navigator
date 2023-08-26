const URL2 = 'https://trackapi.nutritionix.com/v2/search/instant';
const headers = {
  'Content-Type': 'application/json',
  'x-app-id': "ab265269",
  'x-app-key': "a6d0021eb1ef02e5d661b8c2065347f9",
  'x-remote-user-id': 0,
};

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

const ATTR_ID_MAP = {
  203: 'Protein',
  204: 'Total Fat',
  208: 'Calories',
  269: 'Total Sugars'
};

function getSelectedNutrients(nutrients) {
  const selectedNutrients = {};
  for (const nutrient of nutrients) {
    if (ATTR_ID_MAP[nutrient.attr_id]) {
      selectedNutrients[ATTR_ID_MAP[nutrient.attr_id]] = nutrient.value;
    }
  }
  return selectedNutrients;
}

async function fetchRestaurantData(query) {
  const params = {
    query: query,
    self: true,
    branded: true,
    common: true,
    detailed: true,
  };

  try {
    const response = await axios.post(URL2, params, {
      headers,
    });
    return response.data.branded;
  } catch (error) {
    console.error('Error fetching data from Nutritionix API', error);
    throw error;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    const data = await fetchRestaurantData(searchItem);
    data.forEach(item => {
      const nutrients = getSelectedNutrients(item.full_nutrients);
      
      const foodRow = document.createElement('div');
      foodRow.setAttribute('class', 'row');
  
      const foodColumn = document.createElement('div');
      foodColumn.setAttribute('class', 'column');
  
      const foodCard = document.createElement('div');
      foodCard.setAttribute('class', 'food-card');
  
      const foodName = document.createElement('h3');
      foodName.textContent = item.food_name;
  
      const protein = document.createElement('p');
      protein.textContent = `Protein: ${nutrients['Protein'] ?? 'N/A'}g`;
  
      const calories = document.createElement('p');
      calories.textContent = `Calories: ${nutrients['Calories'] ?? 'N/A'}`;
  
      const totalFat = document.createElement('p');
      totalFat.textContent = `Total Fat: ${nutrients['Total Fat'] ?? 'N/A'}g`;
  
      const totalSugars = document.createElement('p');
      totalSugars.textContent = `Total Sugars: ${nutrients['Total Sugars'] ?? 'N/A'}g`;
  
      foodCard.appendChild(foodName);
      foodCard.appendChild(protein);
      foodCard.appendChild(calories);
      foodCard.appendChild(totalFat);
      foodCard.appendChild(totalSugars);
      foodColumn.appendChild(foodCard);
      foodRow.appendChild(foodColumn);
  
      main.appendChild(foodRow);
    });
    search.value = "";
  }
});


  /*async function getInfo2() {
    try {
      const response = await axios.post(URL2, params2, {
        headers,
      });
     console.log(response.data)
    } catch (error) {
      console.error('Error fetching data from Nutritionix API', error);
      throw error;
    }
  }*/
  
//Filters information into desired format
  /*getInfo2()
  .then(() => {
    const nutrientNames = {
      203: 'Protein',
      204: 'Total Fat',
      208: 'Calories',
      269: 'Total Sugars'
    };
    function nutrientArray() {
      const nutritionHashMap = {};
      for (const obj of Mcdonalds_Data.branded) {
        const nutrients = obj.full_nutrients;
        const foodName = obj.food_name;
        const IMG= obj.thumb;
        const selectedNutrients = [];
        for (const nutrient of nutrients) {
          if (nutrient.attr_id in nutrientNames) { // Check if attr_id exists in nutrientNames
            selectedNutrients.push({
              nutrient_name: nutrientNames[nutrient.attr_id], // Use the corresponding name
              value: nutrient.value
            });
          }
        }
        nutritionHashMap[foodName] = selectedNutrients;
      }
      return nutritionHashMap;
    }
    const mcdonaldsNutrition = nutrientArray();
    console.log(mcdonaldsNutrition);
  });*/