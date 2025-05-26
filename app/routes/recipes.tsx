import { useNavigate } from "@remix-run/react";
import cocktails from "../../menu.json";

type Cocktail = {
  name: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  description: string;
};

type CocktailMenu = {
  [key: string]: Cocktail;
};

export default function RecipeList() {
  const navigate = useNavigate();
  const cocktailList = Object.entries(cocktails as CocktailMenu);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">전체 레시피 목록</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            ← 메인으로 돌아가기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cocktailList.map(([id, cocktail]) => (
            <div key={id} className="bg-white rounded-lg shadow p-6 border-b-2 border-gray-200 mb-6">
              <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold mb-4">{cocktail.name}</h2>
              
              <div className="mb-4">
                <img
                  src={cocktail.image}
                  alt={cocktail.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">재료:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {cocktail.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">만드는 방법:</h3>
                <ol className="list-decimal list-inside text-gray-600">
                  {cocktail.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <p className="text-gray-600 italic mb-4">{cocktail.description}</p>
              <hr className="border-0 h-1 bg-black" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
