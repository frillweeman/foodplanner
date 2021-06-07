const config = require("config");
const unirest = require("unirest");
const KrogerAPI = require("./Kroger");
require("dotenv").config();

const recipeRequest = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch");

const Ranking = {
  MINIMIZE_MISSING_INGREDIENTS: 0,
  MAXIMIZE_USED_INGREDIENTS: 1,
  RELEVANCE: 2
}

const mealToType = {
  breakfast: "breakfast",
  lunch: "main course",
  dinner: "main course"
};

const weeklyMeat = "chicken";
const { includedMeals, daysPerWeek } = config.get("MealPlanning");
const { diet, excludeIngredients, intolerances, cuisines: cuisine, minCaloriesPerMeal: minCalories } = config.get("FoodPreferences");
const randomOffset = Math.ceil(Math.random() * 900);

recipeRequest.headers({
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "x-rapidapi-host": process.env.RAPIDAPI_HOST,
  "useQueryString": true
});

const kroger = new KrogerAPI(process.env.KROGER_CLIENT_ID, process.env.KROGER_CLIENT_SECRET);
kroger.init()
.then(() => {
  kroger.findProduct("chili garlic sauce", 1).then(({data}) => console.log(data)).catch(e => console.log(e.response.data));
})
.catch(e => console.error(e));

// includedMeals.forEach(meal => {
//   recipeRequest.query({
//     instructionsRequired: true,
//     ranking: Ranking.RELEVANCE,
//     addRecipeInformation: false,
//     number: daysPerWeek,
//     diet,
//     intolerances,
//     includeIngredients: weeklyMeat,
//     type: mealToType[meal],
//     cuisine,
//     excludeIngredients,
//     minCalories,
//     offset: randomOffset
//   });

//   recipeRequest.end(({ error, ...res }) => {
//     if (error) console.error(error);
//     else console.log(res.body);
//   })
// });

