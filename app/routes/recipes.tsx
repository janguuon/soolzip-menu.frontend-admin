import { useNavigate } from "@remix-run/react";
import { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const cocktailList = Object.entries(cocktails as CocktailMenu)
    .filter(([_, cocktail]) =>
      cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">전체 레시피 목록</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            ← 메인으로 돌아가기
          </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="칵테일 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
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
