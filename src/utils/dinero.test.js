   import { formatearDinero } from './dinero.js';

   describe('formatearDinero', () => {
     it('formatea 5990 como pesos chilenos', () => {
       const resultado = formatearDinero(5990);
       expect(resultado).toContain('$5.990');
     });
   });