import { useParams, useNavigate } from "@remix-run/react";
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

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 칵테일 이름으로 매칭되는 레시피 찾기
  const cocktail = Object.values(cocktails).find(
    (cocktail) => cocktail.name === id
  );

  if (!cocktail) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors mb-4"
        >
          ← 메인으로 돌아가기
        </button>
        <p>레시피를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors mb-6"
      >
        ← 메인으로 돌아가기
      </button>

      <h1 className="text-3xl font-bold mb-6">{cocktail.name}</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">재료</h2>
        <ul className="list-disc pl-6 space-y-2">
          {cocktail.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">만드는 방법</h2>
        <ol className="list-decimal pl-6 space-y-4">
          {cocktail.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">설명</h2>
        <p className="text-gray-700">{cocktail.description}</p>
      </div>
    </div>
  );
}
