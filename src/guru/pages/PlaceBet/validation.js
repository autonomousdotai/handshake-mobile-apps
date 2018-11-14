import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  amount: Yup.number().required('Required')
});
