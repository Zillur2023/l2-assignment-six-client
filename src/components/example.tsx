// store/tableSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cells: Array.from({ length: 49 }, () => Array(11).fill(0)), // 49 rows, 11 columns initialized to 0
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    updateCell: (state, action) => {
      const { row, col, value } = action.payload;

      // Update the specific cell value
      state.cells[row][col] = value;

      // Define named variables for each important row
      for (let c = 0; c < 11; c++) {
        const rejects = parseFloat(state.cells[37][c]);
        const totalDefectsQty = state.cells
          .slice(0, 37)
          .reduce((sum, row) => sum + parseFloat(row[c]) || 0, 0); // Sum of columns across rows 0 to 36
        // const totalCheckGmts = parseFloat(state.cells[39][c]);
        const totalDefectiveGmts = parseFloat(state.cells[41][c]);
        // const rejectsQty = parseFloat(state.cells[47][c]);
        const totalPassGmts = parseFloat(state.cells[40][c]);
        const defectiveRectifiedQty = parseFloat(state.cells[44][c]);
        // const DHU = parseFloat(state.cells[43][c]);

        // Calculations with named variables
        const totalCheckGmts = totalPassGmts + totalDefectiveGmts;
        const rejectsQty = rejects;
        const DefectiveBalanceQty = totalDefectiveGmts - (defectiveRectifiedQty || 0);

        // Update state cells with calculated values
        state.cells[39][c] = totalCheckGmts; // Replace totalCheckGmts
        state.cells[47][c] = rejectsQty; // Replace rejectsQty
        state.cells[45][c] = totalDefectiveGmts; 

        if (defectiveRectifiedQty) {

            state.cells[45][c] = DefectiveBalanceQty; 
        }

        // Calculate DHU percentage if totalCheckGmts is not zero
        if (totalCheckGmts) {
          state.cells[43][c] = parseFloat(((totalDefectsQty * 100) / totalCheckGmts).toFixed(2));
        }
      }

      // Calculate sums for the 10th column (index 9) for each row: sum of columns 0 to 9
      for (let r = 0; r < 49; r++) {
        state.cells[r][10] = state.cells[r]
          .slice(0, 10)
          .reduce((sum, cellValue) => sum + parseFloat(cellValue) || 0, 0);
      }

      // Calculate sums for row 42 across columns
      for (let c = 0; c < 11; c++) {
        const totalDefectsQty = state.cells
        .slice(0, 37)
        .reduce((sum, row) => sum + parseFloat(row[c]) || 0, 0);
        state.cells[42][c] = totalDefectsQty
      }
    },
  },
});

export const { updateCell } = tableSlice.actions;
export default tableSlice.reducer;
