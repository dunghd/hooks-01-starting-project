import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier
  } = useHttp();

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: {
          id: data.name, ...reqExtra
        }
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    // // setIsLoading(true);
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hooks-update-3cb3b-default-rtdb.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(res => {
    //   // setIsLoading(false);
    //   dispatchHttp({ type: 'RESPONSE' });
    //   return res.json().then(resData => {
    //     // setUserIngredients(prevIngredients => [
    //     //   ...prevIngredients, 
    //     //   { id: resData.name,...ingredient }
    //     // ]);
    //     dispatch({ type: 'ADD', ingredient: { id: resData.name, ...ingredient } });
    //   });
    // });
    sendRequest(
      'https://react-hooks-update-3cb3b-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    // setIsLoading(true);
    // dispatchHttp({ type: 'SEND' });
    // fetch(`https://react-hooks-update-3cb3b-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
    //   method: 'DELETE',
    // }).then(res => {
    //   // setIsLoading(false);
    //   dispatchHttp({ type: 'RESPONSE' });
    //   // setUserIngredients(prevIngredients =>
    //   //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    //   // );
    //   dispatch({ type: 'DELETE', id: ingredientId })
    // }).catch(err => {
    //   // setError(err.message);
    //   // setIsLoading(false);
    //   dispatchHttp({ type: 'ERROR', errorMessage: err.message })
    // });
    sendRequest(
      `https://react-hooks-update-3cb3b-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT');
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // setError(null);
    // dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler} />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
