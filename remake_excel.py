import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

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

lines = [l.strip().split(',') for l in data_raw.strip().split('\n')]

wb = openpyxl.Workbook()

# ==========================================
# SHEET 1: EXACT MATCH TO USER'S SCREENSHOT
# ==========================================
ws1 = wb.active
ws1.title = 'Sheet1'
ws1.views.sheetView[0].showGridLines = True

# Row 1 height to cleanly house the Logic block
ws1.row_dimensions[1].height = 160

# Column widths
ws1.column_dimensions['A'].width = 13
ws1.column_dimensions['B'].width = 13
ws1.column_dimensions['C'].width = 13
ws1.column_dimensions['D'].width = 13
ws1.column_dimensions['E'].width = 66

font_regular = Font(name='Calibri', size=11)
font_bold = Font(name='Calibri', size=11, bold=True)

# Headers in row 1 (bottom aligned, matching screenshot)
for col_idx, col_name in enumerate(['Input_1', 'Input_2', 'Input_3', 'Output'], 1):
    c = ws1.cell(row=1, column=col_idx, value=col_name)
    c.font = font_regular
    c.alignment = Alignment(horizontal='left', vertical='bottom')

# Logic block in Cell E1 (top aligned, matching screenshot)
logic_text = (
    'Logic:-\n\n'
    'IF Max <= 2 * Min:\n'
    '    Output = (Input_1 + Input_2 + Input_3) / 3\n\n'
    'IF Max > 2 * Min:\n'
    '    Output = (Input_1 + Input_2 + Input_3 - Max) / 2\n\n'
    'Where:-\n'
    '    Min = MIN(Input_1, Input_2, Input_3)\n'
    '    Max = MAX(Input_1, Input_2, Input_3)\n'
    '    (When Max > 2*Min, the highest score is dropped and the lowest two are averaged)'
)

c_e1 = ws1.cell(row=1, column=5, value=logic_text)
c_e1.font = font_regular
c_e1.alignment = Alignment(horizontal='left', vertical='top', wrap_text=True)

# Data rows (rows 2 to 39)
for r_idx, row in enumerate(lines, 2):
    i1, i2, i3, out = int(row[0]), int(row[1]), int(row[2]), float(row[3])
    c1 = ws1.cell(row=r_idx, column=1, value=i1)
    c2 = ws1.cell(row=r_idx, column=2, value=i2)
    c3 = ws1.cell(row=r_idx, column=3, value=i3)
    c4 = ws1.cell(row=r_idx, column=4, value=out)
    
    for c in [c1, c2, c3, c4]:
        c.font = font_regular
        c.alignment = Alignment(horizontal='right', vertical='center')
    
    if out == int(out):
        c4.number_format = '0'
    elif round(out, 1) == out:
        c4.number_format = '0.0'
    else:
        c4.number_format = '0.00'

# ==========================================
# SHEET 2: FORMULA VERIFICATION & AUDIT PROOF
# ==========================================
ws2 = wb.create_sheet(title='Formula_Audit')
ws2.views.sheetView[0].showGridLines = True

fill_header = PatternFill(start_color='2C3E50', end_color='2C3E50', fill_type='solid')
font_header = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
border_thin = Side(border_style='thin', color='D5D8DC')
box_border = Border(left=border_thin, right=border_thin, top=border_thin, bottom=border_thin)

headers2 = [
    'Obs #', 'Input_1', 'Input_2', 'Input_3', 'Actual Output',
    'Min', 'Mid', 'Max', 'Condition: Max <= 2*Min',
    'Formula Applied Output', 'Residual Error', 'Status'
]

ws2.row_dimensions[1].height = 26
for col_idx, h in enumerate(headers2, 1):
    c = ws2.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_header
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = box_border

for r_idx, row in enumerate(lines, 2):
    obs = r_idx - 1
    i1, i2, i3, out = int(row[0]), int(row[1]), int(row[2]), float(row[3])
    
    ws2.cell(row=r_idx, column=1, value=obs).alignment = Alignment(horizontal='center')
    ws2.cell(row=r_idx, column=2, value=i1).alignment = Alignment(horizontal='center')
    ws2.cell(row=r_idx, column=3, value=i2).alignment = Alignment(horizontal='center')
    ws2.cell(row=r_idx, column=4, value=i3).alignment = Alignment(horizontal='center')
    
    c_out = ws2.cell(row=r_idx, column=5, value=out)
    c_out.alignment = Alignment(horizontal='right')
    c_out.number_format = '0.00'
    
    ws2.cell(row=r_idx, column=6, value=f'=MIN(B{r_idx}:D{r_idx})').alignment = Alignment(horizontal='center')
    ws2.cell(row=r_idx, column=7, value=f'=MEDIAN(B{r_idx}:D{r_idx})').alignment = Alignment(horizontal='center')
    ws2.cell(row=r_idx, column=8, value=f'=MAX(B{r_idx}:D{r_idx})').alignment = Alignment(horizontal='center')
    ws2.cell(row=r_idx, column=9, value=f'=IF(H{r_idx}<=2*F{r_idx}, "Consistent (<=2x)", "Outlier (>2x)")').alignment = Alignment(horizontal='center')
    
    c_form = ws2.cell(row=r_idx, column=10, value=f'=IF(H{r_idx}<=2*F{r_idx}, ROUND(AVERAGE(B{r_idx}:D{r_idx}), 2), ROUND((SUM(B{r_idx}:D{r_idx})-H{r_idx})/2, 2))')
    c_form.alignment = Alignment(horizontal='right')
    c_form.number_format = '0.00'
    
    c_res = ws2.cell(row=r_idx, column=11, value=f'=ROUND(ABS(E{r_idx}-J{r_idx}), 2)')
    c_res.alignment = Alignment(horizontal='right')
    c_res.number_format = '0.00'
    
    c_stat = ws2.cell(row=r_idx, column=12, value=f'=IF(K{r_idx}<=0.05, "MATCH", "MISMATCH")')
    c_stat.alignment = Alignment(horizontal='center')
    c_stat.font = Font(name='Calibri', size=11, bold=True, color='1E8449')
    
    for c in range(1, 13):
        ws2.cell(row=r_idx, column=c).border = box_border

for col in ws2.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws2.column_dimensions[col_letter].width = max(max_len + 3, 10)
ws2.column_dimensions['I'].width = 18
ws2.column_dimensions['J'].width = 18

# ==========================================
# SHEET 3: ROUND 1 ASSIGNMENT ANSWERS (A, B, C, D)
# ==========================================
ws3 = wb.create_sheet(title='Round_1_Questions_Answers')
ws3.views.sheetView[0].showGridLines = True

ws3['A1'] = 'THE BLACK BOX CHALLENGE: ROUND 1 DETAILED ANSWERS'
ws3['A1'].font = Font(name='Calibri', size=13, bold=True, color='1B365D')

def make_sec_header(row, title):
    c = ws3.cell(row=row, column=1, value=title)
    c.font = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
    c.fill = fill_header
    ws3.merge_cells(start_row=row, start_column=1, end_row=row, end_column=6)
    ws3.row_dimensions[row].height = 22

row_cur = 3
make_sec_header(row_cur, 'TASK A: WHAT RULE DOES ORION APPEAR TO USE?')
row_cur += 1
answers_a = [
    ('Piecewise Decision Rule', 'ORION evaluates scores based on whether the maximum test score exceeds double the minimum test score.'),
    ('Formula Branch 1', 'If Max <= 2 * Min: Output = (Input_1 + Input_2 + Input_3) / 3 [Average of all 3 assessments].'),
    ('Formula Branch 2', 'If Max > 2 * Min: Output = (Input_1 + Input_2 + Input_3 - Max) / 2 = (Min + Mid) / 2 [Drops the top score and averages the bottom two].'),
    ('Excel Equivalent', '=IF(MAX(A2:C2)<=2*MIN(A2:C2), AVERAGE(A2:C2), (SUM(A2:C2)-MAX(A2:C2))/2)'),
    ('Accuracy Metric', 'Predicts 38 out of 38 observations with 100.0% accuracy (0 residual error).')
]
for lbl, txt in answers_a:
    ws3.cell(row=row_cur, column=1, value=lbl).font = font_bold
    ws3.cell(row=row_cur, column=2, value=txt).font = font_regular
    ws3.merge_cells(start_row=row_cur, start_column=2, end_row=row_cur, end_column=6)
    row_cur += 1

row_cur += 1
make_sec_header(row_cur, 'TASK B: WHICH VARIABLES APPEAR IMPORTANT?')
row_cur += 1
answers_b = [
    ('Order Invariance', 'Inputs are symmetric: Input_1, Input_2, and Input_3 can appear in any order without changing the output.'),
    ('Key Determinants', '1. Min = MIN(Input_1, Input_2, Input_3) [Sets consistency threshold baseline]\n2. Max = MAX(Input_1, Input_2, Input_3) [Tested against 2 * Min, dropped if condition fails]'),
    ('Governing Interaction', 'Ratio = Max / Min. This ratio alone determines whether the top grade is retained or dropped.')
]
for lbl, txt in answers_b:
    ws3.cell(row=row_cur, column=1, value=lbl).font = font_bold
    ws3.cell(row=row_cur, column=2, value=txt).font = font_regular
    ws3.cell(row=row_cur, column=2).alignment = Alignment(wrap_text=True)
    ws3.merge_cells(start_row=row_cur, start_column=2, end_row=row_cur, end_column=6)
    ws3.row_dimensions[row_cur].height = 28 if '\n' in txt else 20
    row_cur += 1

row_cur += 1
make_sec_header(row_cur, 'TASK C: WHAT THRESHOLD OR CONDITION APPEARS TO EXIST?')
row_cur += 1
answers_c = [
    ('Exact Condition', 'Max <= 2 * Min (Equivalently: Max / Min <= 2.0 or Range <= Min).'),
    ('Dataset Verification', 'Consistent Cluster (Ratio <= 2.0): 10 rows (26.3%) -> 3-score mean.\nOutlier Cluster (Ratio > 2.0): 28 rows (73.7%) -> 2-score mean (drop max).'),
    ('Critical Boundary Cases', 'Row 34: [10, 10, 19] -> 19 <= 2*10 (True) -> (10+10+19)/3 = 13.00\nRow 11: [8, 16, 16] -> 16 <= 2*8 (True) -> (8+16+16)/3 = 13.33\nRow 13: [8, 14, 17] -> 17 > 2*8 (False) -> (8+14)/2 = 11.00')
]
for lbl, txt in answers_c:
    ws3.cell(row=row_cur, column=1, value=lbl).font = font_bold
    ws3.cell(row=row_cur, column=2, value=txt).font = font_regular
    ws3.cell(row=row_cur, column=2).alignment = Alignment(wrap_text=True)
    ws3.merge_cells(start_row=row_cur, start_column=2, end_row=row_cur, end_column=6)
    ws3.row_dimensions[row_cur].height = 36 if 'Row 34' in txt else 20
    row_cur += 1

row_cur += 1
make_sec_header(row_cur, 'TASK D: PREDICTIONS FOR UNSEEN OBSERVATIONS & TEST BENCH')
row_cur += 1
calc_hdr = ['Test Case', 'Input_1', 'Input_2', 'Input_3', 'Min', 'Max', 'Predicted Output', 'Condition Rationale']
fill_sub = PatternFill(start_color='EAEDED', end_color='EAEDED', fill_type='solid')

for ci, h in enumerate(calc_hdr, 1):
    c = ws3.cell(row=row_cur, column=ci, value=h)
    c.font = font_bold
    c.fill = fill_sub
    c.border = box_border
    c.alignment = Alignment(horizontal='center')

tests = [
    ('Unseen Case 1 (Equal)', 10, 10, 10, 'All inputs equal (10 <= 20) -> 3-score average.'),
    ('Unseen Case 2 (Exact 2x)', 6, 8, 12, 'Max=12 exactly equals 2*Min=12 -> 3-score average.'),
    ('Unseen Case 3 (Over 2x)', 6, 8, 13, 'Max=13 > 2*Min=12 -> drops 13, averages 6 and 8.'),
    ('Unseen Case 4 (Outlier Peak)', 2, 4, 20, 'Max=20 > 2*2=4 -> drops 20, averages 2 and 4.'),
    ('Unseen Case 5 (Consistent High)', 14, 17, 19, 'Max=19 <= 2*14=28 -> 3-score average.')
]

for ti, (tc, v1, v2, v3, rat) in enumerate(tests, 1):
    r = row_cur + ti
    ws3.cell(row=r, column=1, value=tc).font = font_bold
    ws3.cell(row=r, column=2, value=v1).alignment = Alignment(horizontal='center')
    ws3.cell(row=r, column=3, value=v2).alignment = Alignment(horizontal='center')
    ws3.cell(row=r, column=4, value=v3).alignment = Alignment(horizontal='center')
    ws3.cell(row=r, column=5, value=f'=MIN(B{r}:D{r})').alignment = Alignment(horizontal='center')
    ws3.cell(row=r, column=6, value=f'=MAX(B{r}:D{r})').alignment = Alignment(horizontal='center')
    
    p = ws3.cell(row=r, column=7, value=f'=IF(F{r}<=2*E{r}, ROUND(AVERAGE(B{r}:D{r}), 2), ROUND((SUM(B{r}:D{r})-F{r})/2, 2))')
    p.alignment = Alignment(horizontal='right')
    p.font = font_bold
    p.number_format = '0.00'
    
    ws3.cell(row=r, column=8, value=rat).font = font_regular
    for c in range(1, 9):
        ws3.cell(row=r, column=c).border = box_border

row_cur += len(tests) + 2
make_sec_header(row_cur, 'CRITICAL LEARNING MOMENT: COMPETING EXPLANATIONS')
row_cur += 1
clm = [
    ('Explanation 1 (Outlier Policy)', 'The university intended to discard suspicious single high test spikes (cheating/fluke) where a student scored more than double their lowest test.'),
    ('Explanation 2 (Inverted Logic Bug)', 'The university intended "Best 2 of 3 Assessments" (drop lowest score), but the programmer mistakenly wrote MAX() instead of MIN(), penalizing improving students.'),
    ('Disambiguating Evidence', '1. Source code inspection of the function name (e.g. drop_lowest vs drop_highest).\n2. Academic policy charter from university faculty senate.\n3. Testing an inverse edge case like (18, 19, 2) where drop-worst gives 18.5 but ORION gives 10.0.')
]
for lbl, txt in clm:
    ws3.cell(row=row_cur, column=1, value=lbl).font = font_bold
    ws3.cell(row=row_cur, column=2, value=txt).font = font_regular
    ws3.cell(row=row_cur, column=2).alignment = Alignment(wrap_text=True)
    ws3.merge_cells(start_row=row_cur, start_column=2, end_row=row_cur, end_column=6)
    ws3.row_dimensions[row_cur].height = 24
    row_cur += 1

ws3.column_dimensions['A'].width = 24
ws3.column_dimensions['B'].width = 12
ws3.column_dimensions['C'].width = 12
ws3.column_dimensions['D'].width = 12
ws3.column_dimensions['E'].width = 10
ws3.column_dimensions['F'].width = 10
ws3.column_dimensions['G'].width = 16
ws3.column_dimensions['H'].width = 40

# Save files:
target1 = 'd:/Programming/Sid_Portfolio/ORION_Round_1_Submission.xlsx'
wb.save(target1)
print('Successfully saved:', target1)

# Also attempt saving to the original filename in case the user closed it
try:
    target2 = 'd:/Programming/Sid_Portfolio/ORION_Black_Box_Investigation_Round_1.xlsx'
    wb.save(target2)
    print('Successfully saved:', target2)
except Exception as e:
    print('Could not overwrite original filename (likely currently open in Excel):', e)
