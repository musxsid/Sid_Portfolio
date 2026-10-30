import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

# Sheet 1: Dataset & Verification
ws1 = wb.active
ws1.title = 'Audit_Dataset'

data_raw = '''16,18,2,9.0
19,6,6,6.0
19,16,5,10.5
5,3,16,4.0
11,4,15,7.5
12,11,18,13.67
1,5,14,3.0
5,16,2,3.5
5,16,10,7.5
5,17,19,11.0
17,5,3,4.0
16,16,8,13.33
15,18,5,10.0
8,17,14,11.0
9,14,11,11.33
1,2,11,1.5
18,13,15,15.33
6,3,20,4.5
15,18,16,16.33
18,13,11,14.0
17,9,14,13.33
13,7,20,10.0
16,13,13,14.0
20,3,8,5.5
12,14,5,8.5
14,4,4,4.0
13,3,11,7.0
4,15,4,4.0
4,17,15,9.5
17,9,1,5.0
2,10,12,6.0
14,2,11,6.5
10,8,3,5.5
11,7,8,8.67
10,10,19,13.0
15,6,10,8.0
19,13,8,10.5
9,11,20,10.0'''

lines = [line.strip().split(',') for line in data_raw.strip().split('\n')]

# Styles - Clean, professional, understated (NOT overly decorated or AI-looking)
font_title = Font(name='Calibri', size=13, bold=True, color='1B365D')
font_subtitle = Font(name='Calibri', size=10, italic=True, color='595959')
font_header = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
font_bold = Font(name='Calibri', size=11, bold=True)
font_regular = Font(name='Calibri', size=11)

fill_header = PatternFill(start_color='2C3E50', end_color='2C3E50', fill_type='solid') # Classic slate navy
fill_subtotal = PatternFill(start_color='EAEDED', end_color='EAEDED', fill_type='solid') # Subtle soft gray
fill_zebra = PatternFill(start_color='F8F9F9', end_color='F8F9F9', fill_type='solid') # Very light alternating row
fill_match = PatternFill(start_color='E8F8F5', end_color='E8F8F5', fill_type='solid') # Soft sage tint for matches

border_thin = Side(border_style='thin', color='D5D8DC')
border_thick_bottom = Side(border_style='medium', color='2C3E50')
box_border = Border(left=border_thin, right=border_thin, top=border_thin, bottom=border_thin)
header_border = Border(left=border_thin, right=border_thin, top=border_thin, bottom=border_thick_bottom)

# Title block
ws1['A1'] = 'ORION DECISION SYSTEM AUDIT - ROUND 1 DATASET RECONSTRUCTION'
ws1['A1'].font = font_title
ws1['A2'] = 'Independent Investigation Unit | 38 Audit Observations with Verification Formulas'
ws1['A2'].font = font_subtitle

headers = [
    'Obs #', 'Input 1', 'Input 2', 'Input 3', 'ORION Output',
    'Min', 'Mid', 'Max', 'Condition: Max <= 2*Min',
    'Inferred Logic Applied', 'Model Calculated', 'Residual Error', 'Status'
]

row_num = 4
for col_idx, h in enumerate(headers, 1):
    cell = ws1.cell(row=row_num, column=col_idx, value=h)
    cell.font = font_header
    cell.fill = fill_header
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    cell.border = header_border

ws1.row_dimensions[4].height = 28

for idx, parts in enumerate(lines, 1):
    r = row_num + idx
    i1, i2, i3, actual_out = int(parts[0]), int(parts[1]), int(parts[2]), float(parts[3])
    
    ws1.cell(row=r, column=1, value=idx).alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=2, value=i1).alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=3, value=i2).alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=4, value=i3).alignment = Alignment(horizontal='center')
    
    out_cell = ws1.cell(row=r, column=5, value=actual_out)
    out_cell.alignment = Alignment(horizontal='right')
    out_cell.number_format = '0.00'
    
    # Standard Excel Formulas
    ws1.cell(row=r, column=6, value=f'=MIN(B{r}:D{r})').alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=7, value=f'=MEDIAN(B{r}:D{r})').alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=8, value=f'=MAX(B{r}:D{r})').alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=9, value=f'=IF(H{r}<=2*F{r}, "Consistent", "Outlier")').alignment = Alignment(horizontal='center')
    ws1.cell(row=r, column=10, value=f'=IF(H{r}<=2*F{r}, "Mean of all 3", "Drop Max (Mean of lowest 2)")').alignment = Alignment(horizontal='left')
    
    model_cell = ws1.cell(row=r, column=11, value=f'=IF(H{r}<=2*F{r}, ROUND(AVERAGE(B{r}:D{r}), 2), ROUND((SUM(B{r}:D{r})-H{r})/2, 2))')
    model_cell.alignment = Alignment(horizontal='right')
    model_cell.number_format = '0.00'
    
    res_cell = ws1.cell(row=r, column=12, value=f'=ROUND(ABS(E{r}-K{r}), 2)')
    res_cell.alignment = Alignment(horizontal='right')
    res_cell.number_format = '0.00'
    
    status_cell = ws1.cell(row=r, column=13, value=f'=IF(L{r}<=0.05, "MATCH", "MISMATCH")')
    status_cell.alignment = Alignment(horizontal='center')
    status_cell.font = Font(name='Calibri', size=11, bold=True, color='1E8449')
    
    for col in range(1, 14):
        c = ws1.cell(row=r, column=col)
        c.border = box_border
        if idx % 2 == 0:
            c.fill = fill_zebra

# Summary row
summary_row = row_num + len(lines) + 1
ws1.cell(row=summary_row, column=1, value='Total Observations / Accuracy Summary').font = font_bold
ws1.merge_cells(start_row=summary_row, start_column=1, end_row=summary_row, end_column=10)
for c in range(1, 11):
    ws1.cell(row=summary_row, column=c).fill = fill_subtotal
    ws1.cell(row=summary_row, column=c).border = box_border

ws1.cell(row=summary_row, column=11, value=f'=COUNTIF(M5:M{summary_row-1}, "MATCH")').font = font_bold
ws1.cell(row=summary_row, column=11).alignment = Alignment(horizontal='center')
ws1.cell(row=summary_row, column=11).fill = fill_subtotal
ws1.cell(row=summary_row, column=11).border = box_border

ws1.cell(row=summary_row, column=12, value='Accuracy:').font = font_bold
ws1.cell(row=summary_row, column=12).fill = fill_subtotal
ws1.cell(row=summary_row, column=12).border = box_border

acc_cell = ws1.cell(row=summary_row, column=13, value=f'=COUNTIF(M5:M{summary_row-1}, "MATCH")/COUNT(A5:A{summary_row-1})')
acc_cell.font = Font(name='Calibri', size=11, bold=True, color='1E8449')
acc_cell.number_format = '0.0%'
acc_cell.alignment = Alignment(horizontal='center')
acc_cell.fill = fill_match
acc_cell.border = box_border

# Autofit column widths
for col in ws1.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws1.column_dimensions[col_letter].width = max(max_len + 3, 10)
ws1.column_dimensions['A'].width = 8
ws1.column_dimensions['I'].width = 16
ws1.column_dimensions['J'].width = 28
ws1.column_dimensions['K'].width = 16
ws1.column_dimensions['L'].width = 14
ws1.column_dimensions['M'].width = 12

# Sheet 2: Executive Submission & Round 1 Solution
ws2 = wb.create_sheet(title='Round_1_Report')
ws2.views.sheetView[0].showGridLines = True

ws2['A1'] = 'THE BLACK BOX CHALLENGE: ROUND 1 INVESTIGATION DOSSIER'
ws2['A1'].font = Font(name='Calibri', size=14, bold=True, color='1B365D')
ws2['A2'] = 'Mission: Reverse-Engineer ORION Decision Rules | Submission Prepared for University Audit Board'
ws2['A2'].font = font_subtitle

def write_section_header(row, text):
    cell = ws2.cell(row=row, column=1, value=text)
    cell.font = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
    cell.fill = fill_header
    ws2.merge_cells(start_row=row, start_column=1, end_row=row, end_column=8)
    ws2.row_dimensions[row].height = 24
    for c in range(1, 9):
        ws2.cell(row=row, column=c).border = box_border

cur_row = 4

# Task A
write_section_header(cur_row, 'TASK A: WHAT RULE DOES ORION APPEAR TO USE? (6 MARKS)')
cur_row += 1
task_a_text = [
    ('System Logic Overview', 'ORION evaluates three student assessments using a conditional consistency heuristic based on the ratio between the maximum and minimum score.'),
    ('Branch 1 (Consistent Scores)', 'If Max <= 2 * Min: Output = (Input_1 + Input_2 + Input_3) / 3 [Standard arithmetic mean of all 3 scores].'),
    ('Branch 2 (Discrepant/Outlier)', 'If Max > 2 * Min: Output = (Input_1 + Input_2 + Input_3 - Max) / 2 = (Min + Mid) / 2 [Drops the highest score and averages the lowest two].'),
    ('Mathematical Formulation', 'Output = IF(MAX(I1,I2,I3) <= 2*MIN(I1,I2,I3), AVERAGE(I1,I2,I3), (SUM(I1,I2,I3) - MAX(I1,I2,I3)) / 2)'),
    ('Empirical Verification', 'Across all 38 audit observations, this piecewise rule achieves 100.0% accuracy (0 residual error across all rows).')
]
for label, desc in task_a_text:
    ws2.cell(row=cur_row, column=1, value=label).font = font_bold
    ws2.cell(row=cur_row, column=1).alignment = Alignment(vertical='top')
    cell = ws2.cell(row=cur_row, column=2, value=desc)
    cell.font = font_regular
    cell.alignment = Alignment(wrap_text=True, vertical='top')
    ws2.merge_cells(start_row=cur_row, start_column=2, end_row=cur_row, end_column=8)
    ws2.row_dimensions[cur_row].height = 20
    cur_row += 1

cur_row += 1
# Task B
write_section_header(cur_row, 'TASK B: WHICH VARIABLES APPEAR IMPORTANT? (4 MARKS)')
cur_row += 1
task_b_text = [
    ('Order Invariance (Symmetry)', 'All three inputs (Input_1, Input_2, Input_3) are order-invariant. The output depends solely on the sorted magnitude of values, not input position.'),
    ('Primary Governing Features', '1. Minimum Score: Min = MIN(Input_1, Input_2, Input_3) - establishes the lower consistency baseline.\n2. Maximum Score: Max = MAX(Input_1, Input_2, Input_3) - tested against the baseline threshold.'),
    ('Derived Interaction Variable', 'Ratio = Max / Min (or Spread = Max - Min relative to Min). This relative scale determines the branching condition.'),
    ('Intermediate Feature', 'Mid Value: Median score is incorporated into the average but plays no role in determining whether a score is dropped.')
]
for label, desc in task_b_text:
    ws2.cell(row=cur_row, column=1, value=label).font = font_bold
    ws2.cell(row=cur_row, column=1).alignment = Alignment(vertical='top')
    cell = ws2.cell(row=cur_row, column=2, value=desc)
    cell.font = font_regular
    cell.alignment = Alignment(wrap_text=True, vertical='top')
    ws2.merge_cells(start_row=cur_row, start_column=2, end_row=cur_row, end_column=8)
    ws2.row_dimensions[cur_row].height = 28 if '\n' in desc else 20
    cur_row += 1

cur_row += 1
# Task C
write_section_header(cur_row, 'TASK C: WHAT THRESHOLD OR CONDITION APPEARS TO EXIST? (4 MARKS)')
cur_row += 1
task_c_text = [
    ('Exact Decision Boundary', 'The critical threshold is Max / Min = 2.0 (Equivalently: Max <= 2 * Min, or Range <= Min).'),
    ('Partition Statistics', 'Consistent Cluster (Ratio <= 2.0): 10 rows (26.3% of observations) -> All 3 scores are averaged.\nOutlier Cluster (Ratio > 2.0): 28 rows (73.7% of observations) -> Top assessment is discarded.'),
    ('Boundary Proof Cases', 'Row 34: [10, 10, 19] -> Max/Min = 19/10 = 1.90 <= 2.0 -> All 3 averaged (Output = 13.00).\nRow 11: [8, 16, 16] -> Max/Min = 16/8 = 2.00 <= 2.0 -> All 3 averaged (Output = 13.33).\nRow 13: [8, 14, 17] -> Max/Min = 17/8 = 2.125 > 2.0 -> Max dropped (Output = 11.00).\nRow 37: [9, 11, 20] -> Max/Min = 20/9 = 2.22 > 2.0 -> Max dropped (Output = 10.00).')
]
for label, desc in task_c_text:
    ws2.cell(row=cur_row, column=1, value=label).font = font_bold
    ws2.cell(row=cur_row, column=1).alignment = Alignment(vertical='top')
    cell = ws2.cell(row=cur_row, column=2, value=desc)
    cell.font = font_regular
    cell.alignment = Alignment(wrap_text=True, vertical='top')
    ws2.merge_cells(start_row=cur_row, start_column=2, end_row=cur_row, end_column=8)
    ws2.row_dimensions[cur_row].height = 42 if 'Row 34' in desc else 24
    cur_row += 1

cur_row += 1
# Task D
write_section_header(cur_row, 'TASK D: PREDICTIONS FOR UNSEEN OBSERVATIONS & LIVE CALCULATOR (5 MARKS)')
cur_row += 1
calc_headers = ['Test Case #', 'Input 1', 'Input 2', 'Input 3', 'Min', 'Max', 'Threshold Check', 'Predicted Output', 'Structural Justification']
for c_idx, h in enumerate(calc_headers, 1):
    c = ws2.cell(row=cur_row, column=c_idx, value=h)
    c.font = font_bold
    c.fill = fill_subtotal
    c.alignment = Alignment(horizontal='center')
    c.border = box_border

test_cases = [
    ('Unseen Case 1 (Boundary: Equal)', 10, 10, 10, 'All inputs identical; Max <= 2*Min holds strictly.'),
    ('Unseen Case 2 (Boundary: Exact 2x)', 6, 8, 12, 'Max (12) exactly equals 2*Min (12); condition holds -> 3-score mean.'),
    ('Unseen Case 3 (Boundary: Exceeds 2x)', 6, 8, 13, 'Max (13) > 2*Min (12); condition breaches -> drops 13, averages 6 and 8.'),
    ('Unseen Case 4 (Extreme Spike)', 2, 4, 20, 'Severe disparity: 20 > 2*2; drops highest score 20, averages 2 and 4.'),
    ('Unseen Case 5 (High Consistency)', 14, 17, 19, 'Narrow spread at high scores; 19 <= 28; all 3 scores included.')
]

start_calc_row = cur_row + 1
for idx, (tc_name, t1, t2, t3, just) in enumerate(test_cases, 1):
    r = cur_row + idx
    ws2.cell(row=r, column=1, value=tc_name).font = font_bold
    ws2.cell(row=r, column=2, value=t1).alignment = Alignment(horizontal='center')
    ws2.cell(row=r, column=3, value=t2).alignment = Alignment(horizontal='center')
    ws2.cell(row=r, column=4, value=t3).alignment = Alignment(horizontal='center')
    ws2.cell(row=r, column=5, value=f'=MIN(B{r}:D{r})').alignment = Alignment(horizontal='center')
    ws2.cell(row=r, column=6, value=f'=MAX(B{r}:D{r})').alignment = Alignment(horizontal='center')
    ws2.cell(row=r, column=7, value=f'=IF(F{r}<=2*E{r}, "Consistent (<=2x)", "Outlier (>2x)")').alignment = Alignment(horizontal='center')
    out_c = ws2.cell(row=r, column=8, value=f'=IF(F{r}<=2*E{r}, ROUND(AVERAGE(B{r}:D{r}), 2), ROUND((SUM(B{r}:D{r})-F{r})/2, 2))')
    out_c.alignment = Alignment(horizontal='right')
    out_c.number_format = '0.00'
    out_c.font = Font(name='Calibri', size=11, bold=True, color='1B365D')
    ws2.cell(row=r, column=9, value=just).font = font_regular
    for c in range(1, 10):
        ws2.cell(row=r, column=c).border = box_border

cur_row += len(test_cases) + 2

# Critical Learning Moment
write_section_header(cur_row, 'CRITICAL LEARNING MOMENT: COMPETING EXPLANATIONS & DISAMBIGUATION')
cur_row += 1
clm_text = [
    ('The Core Analytical Question', 'Does fitting the data mean we have explained the true generative system? No. Two distinct mechanisms fit identically.'),
    ('Competing Explanation 1 (Policy Heuristic)', 'ORION was designed with an aggressive anti-cheating / outlier suppression policy. If a student exhibits an unusually high peak (more than double their weakest assessment), the system treats it as an unrepresentative anomaly or unfair advantage, discarding it.'),
    ('Competing Explanation 2 (Catastrophic Bug)', 'ORION intended to implement the standard university policy: "Best 2 of 3 Assessments" (dropping the lowest score). The developer wrote MAX() instead of MIN() when identifying the score to exclude, inadvertently penalizing students when they achieve higher scores.'),
    ('Evidence Needed to Distinguish', '1. Source Code / Repository Audit: Inspect whether the function was labeled drop_lowest() with an inverted operator.\n2. Institutional Policy Documents: Verify if the Academic Board approved a drop-worst or drop-best continuous assessment model.\n3. Stakeholder Intent Interviews: Question whether the design team conceived ORION as a fraud detection filter or a student welfare system.'),
    ('The 94% Trap Insight', 'A naïve machine learning decision tree splits at Range <= 8, achieving 94.7% accuracy (36/38). The briefing warns of a "94.2% accuracy report." Deploying based on 94% accuracy conceals the fact that the underlying policy systematically punishes score improvements.')
]
for label, desc in clm_text:
    ws2.cell(row=cur_row, column=1, value=label).font = font_bold
    ws2.cell(row=cur_row, column=1).alignment = Alignment(vertical='top')
    cell = ws2.cell(row=cur_row, column=2, value=desc)
    cell.font = font_regular
    cell.alignment = Alignment(wrap_text=True, vertical='top')
    ws2.merge_cells(start_row=cur_row, start_column=2, end_row=cur_row, end_column=8)
    ws2.row_dimensions[cur_row].height = 36 if '\n' in desc else 24
    cur_row += 1

cur_row += 1
# Edge Cases & Uncertainty
write_section_header(cur_row, 'IDENTIFYING MODEL UNCERTAINTY & EDGE CASES (2 MARKS)')
cur_row += 1
edge_text = [
    ('Zero-Score Edge Case', 'If Min = 0 (e.g. absent from an exam): 2 * Min = 0. Under Max <= 2*Min, ANY non-zero score causes Max > 2*Min, meaning a student with [0, 0, 15] or [0, 10, 15] will always have their maximum score discarded.'),
    ('Tied Maximums', 'If two scores share the maximum (e.g. [5, 16, 16]): Sum - Max removes only one 16, yielding (5+16)/2 = 10.5. System behavior is stable in arithmetic, but institutional justification for dropping one identical test over another is undefined.'),
    ('Near-Threshold Sensitivity', 'Small score fluctuations around the 2x ratio cause abrupt output discontinuities. For example, [7, 8, 14] gives Output = 9.67, whereas [7, 8, 15] drops 15 to give Output = 7.50. Increasing a test score by 1 point reduces the final grade by 2.17 points!')
]
for label, desc in edge_text:
    ws2.cell(row=cur_row, column=1, value=label).font = font_bold
    ws2.cell(row=cur_row, column=1).alignment = Alignment(vertical='top')
    cell = ws2.cell(row=cur_row, column=2, value=desc)
    cell.font = font_regular
    cell.alignment = Alignment(wrap_text=True, vertical='top')
    ws2.merge_cells(start_row=cur_row, start_column=2, end_row=cur_row, end_column=8)
    ws2.row_dimensions[cur_row].height = 28 if 'Zero' in label or 'Tied' in label else 38
    cur_row += 1

# Formatting sheet 2
ws2.column_dimensions['A'].width = 24
ws2.column_dimensions['B'].width = 10
ws2.column_dimensions['C'].width = 10
ws2.column_dimensions['D'].width = 10
ws2.column_dimensions['E'].width = 8
ws2.column_dimensions['F'].width = 8
ws2.column_dimensions['G'].width = 18
ws2.column_dimensions['H'].width = 16
ws2.column_dimensions['I'].width = 45

excel_path = 'd:/Programming/Sid_Portfolio/ORION_Black_Box_Investigation_Round_1.xlsx'
wb.save(excel_path)
print('Successfully saved Excel workbook to:', excel_path)
