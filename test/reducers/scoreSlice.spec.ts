import { AnyAction } from 'redux';
import counterReducer, {
  updateNameScore,
  removeNameScore,
  clearNameScore,
  updateSearch,
} from '../../app/features/scoreSlice';

describe('reducers', () => {
  describe('scoreSlice', () => {
    it('should handle initial state', () => {
      expect(counterReducer(undefined, {} as AnyAction)).toMatchSnapshot();
    });

    it('should handle updateNameScore', () => {
      const newNameScore = {
        nameScore: [
          {
            name: 'name',
            path: 'path',
            score: 1,
            keywords: [],
            degree: '',
            links: [],
            school: '',
            text: '',
            level: '',
            levelValue: 0,
            levelSalary: 0,
            phone: '',
            workAge: 0,
            salary: '',
            sentiment: 0,
          },
        ],
        search: '',
      };
      expect(
        counterReducer(newNameScore, {
          type: updateNameScore,
          payload: newNameScore,
        })
      ).toMatchSnapshot();
    });
    it('should handle removeNameScore', () => {
      const newNameScore = {
        nameScore: [
          {
            name: 'name',
            path: 'path',
            score: 1,
            keywords: [],
            degree: '',
            links: [],
            school: '',
            text: '',
            level: '',
            levelValue: 0,
            levelSalary: 0,
            phone: '',
            workAge: 0,
            salary: '',
            sentiment: 0,
          },
        ],
        search: '',
      };
      expect(
        counterReducer(newNameScore, {
          type: removeNameScore,
          payload: newNameScore,
        })
      ).toMatchSnapshot();
    });
    it('should handle clearNameScore', () => {
      const newNameScore = {
        nameScore: [
          {
            name: 'name',
            path: 'path',
            score: 1,
            keywords: [],
            degree: '',
            links: [],
            school: '',
            text: '',
            level: '',
            levelSalary: 0,
            levelValue: 0,
            phone: '',
            workAge: 0,
            salary: '',
            sentiment: 0,
          },
        ],
        search: '',
      };
      expect(
        counterReducer(newNameScore, {
          type: clearNameScore,
        })
      ).toMatchSnapshot();
    });
    it('should handle updateSearch', () => {
      expect(
        counterReducer(
          { search: '', nameScore: [] },
          {
            type: updateSearch,
            payload: 'test',
          }
        )
      ).toMatchSnapshot();
    });
  });
});
