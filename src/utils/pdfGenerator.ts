import jsPDF from 'jspdf';
import { MealPlan } from '../types';

// Arabic text processing utilities
export const reverseArabicText = (text: string): string => {
  // Simple Arabic text reversal for RTL display
  // This is a basic implementation - for production, consider using a proper Arabic shaping library
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  if (!arabicRegex.test(text)) {
    return text; // Not Arabic text, return as-is
  }
  
  // Split by spaces and reverse word order for RTL
  const words = text.split(' ');
  return words.reverse().join(' ');
};

export const isRTLLanguage = (language: string): boolean => {
  return ['ar', 'he', 'fa', 'ur'].includes(language);
};

export const formatTextForPDF = (text: string, language: string): string => {
  if (isRTLLanguage(language)) {
    return reverseArabicText(text);
  }
  return text;
};

// Shopping list PDF — mise en page moderne 2 colonnes
export const generateShoppingListPDF = (
  title: string,
  items: Array<{ name: string; amount: string; unit: string; category: string }>,
  language: string,
  translations: {
    generatedOn: string;
    totalItems: string;
    itemsToBuyTitle: string;
  }
) => {
  const doc = new jsPDF();
  const isRTL = isRTLLanguage(language);
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const COLOR_PRIMARY   = [94, 46, 237] as [number,number,number];
  const COLOR_ACCENT    = [249, 115, 22] as [number,number,number];
  const COLOR_BG_HEADER = [248, 245, 255] as [number,number,number];
  const COLOR_ROW_ODD   = [252, 251, 255] as [number,number,number];
  const COLOR_ROW_EVEN  = [255, 255, 255] as [number,number,number];
  const COLOR_TEXT      = [30, 30, 40] as [number,number,number];
  const COLOR_MUTED     = [120, 110, 140] as [number,number,number];
  const COLOR_BORDER    = [220, 215, 235] as [number,number,number];
  const COLOR_CHECK_BG  = [237, 233, 254] as [number,number,number];

  const MARGIN   = 14;
  const COL_GAP  = 6;
  const colW     = (pageWidth - MARGIN * 2 - COL_GAP) / 2;
  const ROW_H    = 10;
  const HEADER_H = 26;

  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, HEADER_H, "F");
  doc.setFillColor(...COLOR_ACCENT);
  doc.rect(0, HEADER_H - 3, pageWidth, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleX = isRTL ? pageWidth - MARGIN : MARGIN;
  const titleAlign = isRTL ? "right" : "left";
  doc.text(formatTextForPDF(title, language), titleX, 12, { align: titleAlign });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(210, 200, 255);
  const dateStr = new Date().toLocaleDateString();
  const subtitle = formatTextForPDF(
    `${translations.generatedOn}: ${dateStr}   •   ${translations.totalItems}: ${items.length}`,
    language
  );
  doc.text(subtitle, titleX, 21, { align: titleAlign });

  const grouped: Record<string, typeof items> = {};
  items.forEach(item => {
    const cat = item.category || "Autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  type Row = { type: "header"; label: string } | { type: "item"; item: typeof items[0] };
  const rows: Row[] = [];
  Object.entries(grouped).forEach(([cat, catItems]) => {
    rows.push({ type: "header", label: cat });
    catItems.forEach(item => rows.push({ type: "item", item }));
  });

  const half = Math.ceil(rows.length / 2);
  const leftRows  = rows.slice(0, half);
  const rightRows = rows.slice(half);

  const drawColumn = (colRows: Row[], xStart: number) => {
    let y = HEADER_H + 14;
    colRows.forEach((row, idx) => {
      if (y + ROW_H > pageHeight - 14) return;
      if (row.type === "header") {
        doc.setFillColor(...COLOR_BG_HEADER);
        doc.roundedRect(xStart, y - 6, colW, 9, 1.5, 1.5, "F");
        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.3);
        doc.roundedRect(xStart, y - 6, colW, 9, 1.5, 1.5, "S");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...COLOR_PRIMARY);
        const catX = isRTL ? xStart + colW - 4 : xStart + 4;
        doc.text(formatTextForPDF(row.label.toUpperCase(), language), catX, y, { align: isRTL ? "right" : "left" });
        y += 11;
      } else {
        const rowColor = idx % 2 === 0 ? COLOR_ROW_ODD : COLOR_ROW_EVEN;
        doc.setFillColor(...rowColor);
        doc.rect(xStart, y - 5.5, colW, ROW_H, "F");
        const cbX = isRTL ? xStart + colW - 5 : xStart + 3;
        doc.setFillColor(...COLOR_CHECK_BG);
        doc.roundedRect(cbX, y - 4, 5, 5, 1, 1, "F");
        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.4);
        doc.roundedRect(cbX, y - 4, 5, 5, 1, 1, "S");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLOR_TEXT);
        const nameX = isRTL ? xStart + colW - 12 : xStart + 11;
        const nameText = formatTextForPDF(row.item.name, language);
        const nameLines = doc.splitTextToSize(nameText, colW - 40);
        doc.text(nameLines[0], nameX, y, { align: isRTL ? "right" : "left" });
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...COLOR_ACCENT);
        const qty = `${row.item.amount} ${row.item.unit}`.trim();
        const qtyX = isRTL ? xStart + 3 : xStart + colW - 3;
        doc.text(formatTextForPDF(qty, language), qtyX, y, { align: isRTL ? "left" : "right" });
        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.2);
        doc.line(xStart, y + 4.5, xStart + colW, y + 4.5);
        y += ROW_H + 1;
      }
    });
  };

  const leftX  = isRTL ? MARGIN + colW + COL_GAP : MARGIN;
  const rightX = isRTL ? MARGIN : MARGIN + colW + COL_GAP;
  drawColumn(leftRows, leftX);
  drawColumn(rightRows, rightX);

  const footerY = pageHeight - 8;
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, footerY - 4, pageWidth - MARGIN, footerY - 4);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("KingMenu — Planifiez. Cuisinez. Savourez.", pageWidth / 2, footerY, { align: "center" });

  doc.save(`${title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

// Enhanced recipe PDF generation

// Enhanced recipe PDF generation with RTL support
export const generateRecipePDF = (
  dish: any,
  servings: number,
  language: string,
  translations: {
    ingredients: string;
    instructions: string;
    step: string;
    cookingTime: string;
    difficulty: string;
    servings: string;
  }
) => {
  const doc = new jsPDF();
  const isRTL = isRTLLanguage(language);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let yPosition = 30;
  
  // Title
  doc.setFontSize(20);
  const formattedTitle = formatTextForPDF(dish.title, language);
  if (isRTL) {
    doc.text(formattedTitle, pageWidth - 20, yPosition, { align: 'right' });
  } else {
    doc.text(formattedTitle, 20, yPosition);
  }
  
  yPosition += 20;
  
  // Recipe metadata
  doc.setFontSize(12);
  const metaData = [
    `${translations.cookingTime}: ${dish.cookingTime} min`,
    `${translations.difficulty}: ${dish.difficulty}`,
    `${translations.servings}: ${servings}`
  ];
  
  metaData.forEach(meta => {
    const formattedMeta = formatTextForPDF(meta, language);
    if (isRTL) {
      doc.text(formattedMeta, pageWidth - 20, yPosition, { align: 'right' });
    } else {
      doc.text(formattedMeta, 20, yPosition);
    }
    yPosition += 12;
  });
  
  yPosition += 15;
  
  // Ingredients section
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(16);
  const ingredientsTitle = formatTextForPDF(translations.ingredients, language);
  if (isRTL) {
    doc.text(ingredientsTitle, pageWidth - 20, yPosition, { align: 'right' });
  } else {
    doc.text(ingredientsTitle, 20, yPosition);
  }
  
  yPosition += 20;
  doc.setFontSize(11);
  
  const servingMultiplier = servings / dish.servings;
  
  dish.ingredients.forEach((ingredient: any) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 30;
    }
    
    const adjustedAmount = (parseFloat(ingredient.amount) * servingMultiplier).toFixed(1).replace(/\.0$/, '');
    const ingredientText = formatTextForPDF(
      `• ${ingredient.name} - ${adjustedAmount} ${ingredient.unit}`,
      language
    );
    
    if (isRTL) {
      doc.text(ingredientText, pageWidth - 25, yPosition, { align: 'right' });
    } else {
      doc.text(ingredientText, 25, yPosition);
    }
    
    yPosition += 12;
  });
  
  yPosition += 15;
  
  // Instructions section
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(16);
  const instructionsTitle = formatTextForPDF(translations.instructions, language);
  if (isRTL) {
    doc.text(instructionsTitle, pageWidth - 20, yPosition, { align: 'right' });
  } else {
    doc.text(instructionsTitle, 20, yPosition);
  }
  
  yPosition += 20;
  doc.setFontSize(11);
  
  dish.instructions.forEach((instruction: string, index: number) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 30;
    }
    
    const stepText = formatTextForPDF(
      `${index + 1}. ${instruction}`,
      language
    );
    
    const maxWidth = pageWidth - 50;
    const lines = doc.splitTextToSize(stepText, maxWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 30;
      }
      
      if (isRTL) {
        doc.text(line, pageWidth - 25, yPosition, { align: 'right' });
      } else {
        doc.text(line, 25, yPosition);
      }
      
      yPosition += 12;
    });
    
    yPosition += 5;
  });
  
  // Generate filename
  const filename = `${dish.title.replace(/\s+/g, '-').toLowerCase()}-recipe.pdf`;
  doc.save(filename);
};

// Meal calendar PDF — design moderne coloré
export const generateMealCalendarPDF = (
  startDate: string,
  endDate: string,
  mealsByDate: Record<string, MealPlan[]>,
  language: string,
  translations: {
    title: string; dateRange: string; generatedOn: string; totalMeals: string;
    breakfast: string; lunch: string; dinner: string; snack: string;
    servings: string; cookingTime: string; noMeals: string;
  }
) => {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14;

  const VIOLET:   [number,number,number] = [ 94, 46,237];
  const VIOLET_L: [number,number,number] = [237,233,254];
  const ORANGE:   [number,number,number] = [249,115, 22];
  const GRAY_BG:  [number,number,number] = [248,248,250];
  const GRAY_TXT: [number,number,number] = [120,120,130];
  const DARK:     [number,number,number] = [ 30, 30, 40];
  const WHITE:    [number,number,number] = [255,255,255];
  const BORDER:   [number,number,number] = [220,218,235];
  const MEAL_COLOR: Record<string,[number,number,number]> = {
    breakfast:[251,191,36], lunch:[59,130,246], dinner:[139,92,246], snack:[34,197,94]
  };
  const MEAL_BG: Record<string,[number,number,number]> = {
    breakfast:[255,251,235], lunch:[239,246,255], dinner:[245,243,255], snack:[240,253,244]
  };

  const isRTL = isRTLLanguage(language);
  const al = isRTL ? 'right' : 'left';
  const tx = (x: number) => isRTL ? pageW - x : x;

  const totalMeals = Object.values(mealsByDate).reduce((s,m)=>s+m.length,0);
  const totalCook  = Object.values(mealsByDate).flat().reduce((s,m)=>s+(m.dish?.cookingTime??0),0);

  const dateRange: Date[] = [];
  for (let d=new Date(startDate); d<=new Date(endDate); d.setDate(d.getDate()+1))
    dateRange.push(new Date(d));

  const locOpt = language==='ar' ? 'ar-DZ' : language;

  const drawFooter = () => {
    doc.setDrawColor(...BORDER); doc.setLineWidth(0.4);
    doc.line(M, pageH-10, pageW-M, pageH-10);
    doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(...GRAY_TXT);
    doc.text(`KingMenu — ${translations.generatedOn} ${new Date().toLocaleDateString()}`,
      pageW/2, pageH-5, {align:'center'});
  };

  const drawHeader = (): number => {
    doc.setFillColor(...VIOLET);
    doc.rect(0,0,pageW,38,'F');
    doc.setFillColor(...ORANGE);
    doc.rect(0,38,pageW,3,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.setTextColor(...WHITE);
    doc.text(formatTextForPDF(translations.title, language), tx(M), 17, {align:al});
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(200,190,255);
    const s = new Date(startDate).toLocaleDateString(locOpt,{day:'2-digit',month:'short',year:'numeric'});
    const e = new Date(endDate).toLocaleDateString(locOpt,{day:'2-digit',month:'short',year:'numeric'});
    doc.text(formatTextForPDF(`${s}  —  ${e}`, language), tx(M), 30, {align:al});
    return 48;
  };

  const drawStats = (y: number): number => {
    const cW = (pageW-2*M)/3;
    const stats: [string,string,[number,number,number]][] = [
      [translations.totalMeals, String(totalMeals), VIOLET],
      [translations.dateRange, `${dateRange.length} j`, [16,185,129]],
      ['En cuisine', `${totalCook} min`, ORANGE],
    ];
    stats.forEach(([label,val,col],i) => {
      const x = M + i*cW;
      doc.setFillColor(...GRAY_BG); doc.roundedRect(x,y,cW-3,22,3,3,'F');
      doc.setDrawColor(...BORDER); doc.setLineWidth(0.3); doc.roundedRect(x,y,cW-3,22,3,3,'S');
      doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(...col);
      doc.text(val, x+(cW-3)/2, y+11, {align:'center'});
      doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...GRAY_TXT);
      doc.text(label.toUpperCase(), x+(cW-3)/2, y+19, {align:'center'});
    });
    return y+26;
  };

  const DHEAD=10, MROW=13, EROW=10, PAD=4;
  const estH = (meals: MealPlan[]) =>
    DHEAD + (meals.length===0 ? EROW : meals.length*MROW) + PAD*2 + 4;

  const drawDay = (date: Date, meals: MealPlan[], y: number): number => {
    const h = estH(meals);
    const cW = pageW-2*M;
    doc.setFillColor(...WHITE); doc.roundedRect(M,y,cW,h,3,3,'F');
    doc.setDrawColor(...BORDER); doc.setLineWidth(0.3); doc.roundedRect(M,y,cW,h,3,3,'S');
    doc.setFillColor(...VIOLET_L); doc.roundedRect(M,y,cW,DHEAD,3,3,'F');
    doc.rect(M,y+5,cW,DHEAD-5,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...VIOLET);
    const dl = date.toLocaleDateString(locOpt,{weekday:'long',day:'numeric',month:'long'});
    doc.text(formatTextForPDF(dl,language), tx(M+4), y+7, {align:al});

    let ry = y+DHEAD+PAD;
    if (meals.length===0) {
      doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(...GRAY_TXT);
      doc.text(formatTextForPDF(translations.noMeals,language), tx(M+6), ry+6, {align:al});
    } else {
      const order=['breakfast','lunch','snack','dinner'];
      [...meals].sort((a,b)=>order.indexOf(a.mealType)-order.indexOf(b.mealType))
        .forEach((meal,idx) => {
          doc.setFillColor(...(idx%2===0 ? WHITE : GRAY_BG));
          doc.rect(M+1,ry,cW-2,MROW,'F');
          const mc = MEAL_COLOR[meal.mealType]??VIOLET;
          const mb = MEAL_BG[meal.mealType]??VIOLET_L;
          const ml = (translations as any)[meal.mealType] ?? meal.mealType;
          doc.setFillColor(...mb); doc.roundedRect(M+3,ry+2,22,8,2,2,'F');
          doc.setFont('helvetica','bold'); doc.setFontSize(6); doc.setTextColor(...mc);
          doc.text(formatTextForPDF(ml,language), M+14, ry+7.5, {align:'center'});
          doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(...DARK);
          const titleX = isRTL ? pageW-M-28 : M+28;
          const tLines = doc.splitTextToSize(formatTextForPDF(meal.dish.title,language), cW-58);
          doc.text(tLines[0], titleX, ry+7.5, {align:al});
          doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...GRAY_TXT);
          const metaX = isRTL ? M+3 : pageW-M-3;
          doc.text(`${meal.servings}p · ${meal.dish.cookingTime}min`, metaX, ry+7.5,
            {align: isRTL ? 'left' : 'right'});
          ry += MROW;
        });
    }
    return y+h+4;
  };

  let y = drawHeader();
  y = drawStats(y);
  y += 4;

  dateRange.forEach(date => {
    const meals = mealsByDate[date.toISOString().split('T')[0]] ?? [];
    if (y + estH(meals) + 4 > pageH-16) {
      drawFooter(); doc.addPage(); y = drawHeader(); y += 6;
    }
    y = drawDay(date, meals, y);
  });

  drawFooter();
  doc.save(`planning-repas-${startDate}-${endDate}.pdf`);
};