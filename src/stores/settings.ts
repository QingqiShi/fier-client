import { createStore } from 'libs/lit-firestore';
import { Locale } from 'stores/i18n';
import user from 'stores/user';
import { getLocale } from 'libs/route-utils';

const initialState = {
  locale: getLocale(window.location.pathname),
  categories: [] as Category[],
  ids: { categories: 0 },
};
type State = typeof initialState;

const mutations = {
  setLocale: (_: State, newLocale: Locale) => ({
    locale: newLocale,
  }),
  setCategory: ({ ids, categories }: State, newCategory: Category) =>
    newCategory.id
      ? {
          categories: categories.map((category) =>
            category.id === newCategory.id ? newCategory : category
          ),
        }
      : {
          categories: [
            ...categories,
            { ...newCategory, id: ids.categories + 1 },
          ],
          ids: { ...ids, categories: ids.categories + 1 },
        },
  removeCategory: ({ categories }: State, id: number) => ({
    categories: categories.filter((category) => category.id !== id),
  }),
};

const usePath = () => {
  const [{ isLoggedIn, uid }] = user.useStore();
  return isLoggedIn && `settings/${uid}`;
};

const store = createStore(initialState, mutations, usePath);

export default store;
