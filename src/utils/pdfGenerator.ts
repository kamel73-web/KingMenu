import jsPDF from 'jspdf';
import { MealPlan } from '../types';

// Arabic text processing utilities
export const reverseArabicText = (text: string): string => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (!arabicRegex.test(text)) return text;
  const words = text.split(' ');
  return words.reverse().join(' ');
};

export const isRTLLanguage = (language: string): boolean => {
  return ['ar', 'he', 'fa', 'ur'].includes(language);
};

export const formatTextForPDF = (text: string, language: string): string => {
  if (isRTLLanguage(language)) return reverseArabicText(text);
  return text;
};

// Shopping list PDF — mise en page moderne 2 colonnes avec multipage
export const generateShoppingListPDF = (
  title: string,
  items: Array<{ name: string; amount: string; unit: string; category: string }>,
  language: string,
  translations: {
    generatedOn: string;
    totalItems: string;
    itemsToBuyTitle: string;
    tagline?: string;
    uncategorized?: string;
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
  const FOOTER_H = 14;

  // ── Dessine l'en-tête (réutilisé sur chaque page) ──
  const drawPageHeader = () => {
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
  };

  // ── Dessine le pied de page ──
  const drawPageFooter = () => {
    const footerY = pageHeight - 8;
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, footerY - 4, pageWidth - MARGIN, footerY - 4);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`KingMenu — ${translations.tagline || 'Plan. Cook. Enjoy.'}`, pageWidth / 2, footerY, { align: "center" });
  };

  const grouped: Record<string, typeof items> = {};
  items.forEach(item => {
    const cat = item.category || translations.uncategorized || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  type Row = { type: "header"; label: string } | { type: "item"; item: typeof items[0] };
  const rows: Row[] = [];
  Object.entries(grouped).forEach(([cat, catItems]) => {
    rows.push({ type: "header", label: cat });
    catItems.forEach(item => rows.push({ type: "item", item }));
  });

  // ── Dessine une colonne avec gestion multipage ──
  const drawColumn = (colRows: Row[], xStart: number) => {
    let y = HEADER_H + 14;
    const maxY = pageHeight - FOOTER_H - 4;

    colRows.forEach((row, idx) => {
      // Nouvelle page si nécessaire
      if (y + ROW_H > maxY) {
        drawPageFooter();
        doc.addPage();
        drawPageHeader();
        y = HEADER_H + 14;
      }

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

        // ── Quantité : ne pas afficher si vide ou 0 ──
        const rawAmount = parseFloat(row.item.amount);
        const hasQty = row.item.amount && !isNaN(rawAmount) && rawAmount > 0 && row.item.unit;
        if (hasQty) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_ACCENT);
          const qty = `${row.item.amount} ${row.item.unit}`.trim();
          const qtyX = isRTL ? xStart + 3 : xStart + colW - 3;
          doc.text(formatTextForPDF(qty, language), qtyX, y, { align: isRTL ? "left" : "right" });
        }

        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.2);
        doc.line(xStart, y + 4.5, xStart + colW, y + 4.5);
        y += ROW_H + 1;
      }
    });
  };

  // ── Première page ──
  drawPageHeader();

  const half = Math.ceil(rows.length / 2);
  const leftRows  = rows.slice(0, half);
  const rightRows = rows.slice(half);

  const leftX  = isRTL ? MARGIN + colW + COL_GAP : MARGIN;
  const rightX = isRTL ? MARGIN : MARGIN + colW + COL_GAP;
  drawColumn(leftRows, leftX);
  drawColumn(rightRows, rightX);

  drawPageFooter();
  doc.save(`${title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

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
  
  doc.setFontSize(20);
  const formattedTitle = formatTextForPDF(dish.title, language);
  if (isRTL) {
    doc.text(formattedTitle, pageWidth - 20, yPosition, { align: 'right' });
  } else {
    doc.text(formattedTitle, 20, yPosition);
  }
  
  yPosition += 20;
  
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
  
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = 30; }
  
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
    if (yPosition > pageHeight - 20) { doc.addPage(); yPosition = 30; }
    const rawAmount = parseFloat(ingredient.amount);
    const hasQty = ingredient.amount && !isNaN(rawAmount) && rawAmount > 0 && ingredient.unit;
    const qtyStr = hasQty
      ? ` - ${(rawAmount * servingMultiplier).toFixed(1).replace(/\.0$/, '')} ${ingredient.unit}`
      : '';
    const ingredientText = formatTextForPDF(`• ${ingredient.name}${qtyStr}`, language);
    if (isRTL) {
      doc.text(ingredientText, pageWidth - 25, yPosition, { align: 'right' });
    } else {
      doc.text(ingredientText, 25, yPosition);
    }
    yPosition += 12;
  });
  
  yPosition += 15;
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = 30; }
  
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
    if (yPosition > pageHeight - 30) { doc.addPage(); yPosition = 30; }
    const stepText = formatTextForPDF(`${index + 1}. ${instruction}`, language);
    const maxWidth = pageWidth - 50;
    const lines = doc.splitTextToSize(stepText, maxWidth);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) { doc.addPage(); yPosition = 30; }
      if (isRTL) {
        doc.text(line, pageWidth - 25, yPosition, { align: 'right' });
      } else {
        doc.text(line, 25, yPosition);
      }
      yPosition += 12;
    });
    yPosition += 5;
  });
  
  doc.save(`${dish.title.replace(/\s+/g, '-').toLowerCase()}-recipe.pdf`);
};

// Meal calendar PDF — 1 semaine par page, grille 7 colonnes
export const generateMealCalendarPDF = (
  startDate: string,
  endDate: string,
  mealsByDate: Record<string, MealPlan[]>,
  language: string,
  translations: {
    title: string; dateRange: string; generatedOn: string; totalMeals: string;
    breakfast: string; lunch: string; dinner: string; snack: string;
    servings: string; cookingTime: string; noMeals: string; tagline?: string;
    mealPlanFilename?: string;
  }
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 10;

  const VIOLET:   [number,number,number] = [ 94, 46,237];
  const VIOLET_L: [number,number,number] = [237,233,254];
  const ORANGE:   [number,number,number] = [249,115, 22];
  const GRAY_BG:  [number,number,number] = [248,248,250];
  const GRAY_TXT: [number,number,number] = [120,120,130];
  const DARK:     [number,number,number] = [ 20, 20, 30];
  const WHITE:    [number,number,number] = [255,255,255];
  const BORDER:   [number,number,number] = [220,218,235];
  const MEAL_META: Record<string,{color:[number,number,number];bg:[number,number,number];label:string}> = {
    breakfast:{color:[180,130,10],bg:[255,251,235],label:translations.breakfast},
    lunch:    {color:[ 30,100,210],bg:[239,246,255],label:translations.lunch},
    snack:    {color:[ 20,150, 70],bg:[240,253,244],label:translations.snack},
    dinner:   {color:[100, 60,210],bg:[245,243,255],label:translations.dinner},
  };
  const MEAL_ORDER = ['breakfast','lunch','snack','dinner'];
  const locOpt = language==='ar' ? 'ar-DZ' : language;

  const allDates: Date[] = [];
  for (let d=new Date(startDate); d<=new Date(endDate); d.setDate(d.getDate()+1))
    allDates.push(new Date(d));
  const weeks: Date[][] = [];
  for (let i=0; i<allDates.length; i+=7) weeks.push(allDates.slice(i,i+7));

  const totalMeals = Object.values(mealsByDate).reduce((s,m)=>s+m.length,0);
  const totalCook  = Object.values(mealsByDate).flat().reduce((s,m)=>s+(m.dish?.cookingTime??0),0);

  const HEADER_H = 22;

  const drawHeader = (weekDates: Date[]) => {
    doc.setFillColor(...VIOLET); doc.rect(0,0,pageW,HEADER_H,'F');
    doc.setFillColor(...ORANGE); doc.rect(0,HEADER_H,pageW,2,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(...WHITE);
    doc.text(formatTextForPDF(translations.title,language), M, 10);
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(210,200,255);
    const ws = weekDates[0].toLocaleDateString(locOpt,{day:'numeric',month:'long',year:'numeric'});
    const we = weekDates[weekDates.length-1].toLocaleDateString(locOpt,{day:'numeric',month:'long',year:'numeric'});
    doc.text(`${ws}  →  ${we}`, M, 17);
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...WHITE);
    doc.text(`${totalMeals} repas · ${totalCook} min`, pageW-M, 10, {align:'right'});
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(210,200,255);
    doc.text(`${translations.generatedOn} ${new Date().toLocaleDateString()}`, pageW-M, 17, {align:'right'});
  };

  const drawWeek = (weekDates: Date[]) => {
    drawHeader(weekDates);
    const TOP=HEADER_H+4, BOTTOM=pageH-8, gridH=BOTTOM-TOP;
    const nDays=weekDates.length, dayW=(pageW-2*M)/nDays;
    const DAY_HDR_H=14;

    weekDates.forEach((date,di) => {
      const x=M+di*dayW;
      const ds=date.toISOString().split('T')[0];
      const meals=mealsByDate[ds]??[];
      const isToday=ds===new Date().toISOString().split('T')[0];

      doc.setFillColor(...(isToday?ORANGE:VIOLET_L));
      doc.roundedRect(x,TOP,dayW-2,DAY_HDR_H,2,2,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(8);
      doc.setTextColor(...(isToday?WHITE:VIOLET));
      doc.text(formatTextForPDF(date.toLocaleDateString(locOpt,{weekday:'short'}),language),x+(dayW-2)/2,TOP+6,{align:'center'});
      doc.setFontSize(11); doc.setTextColor(...(isToday?WHITE:DARK));
      doc.text(String(date.getDate()),x+(dayW-2)/2,TOP+12,{align:'center'});

      doc.setFillColor(...(meals.length===0?GRAY_BG:WHITE));
      doc.rect(x,TOP+DAY_HDR_H,dayW-2,gridH-DAY_HDR_H,'F');
      doc.setDrawColor(...BORDER); doc.setLineWidth(0.3);
      doc.roundedRect(x,TOP,dayW-2,gridH,2,2,'S');

      if (meals.length===0) {
        doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(...GRAY_TXT);
        doc.text(formatTextForPDF(translations.noMeals,language),x+(dayW-2)/2,TOP+DAY_HDR_H+(gridH-DAY_HDR_H)/2,{align:'center',maxWidth:dayW-6});
      } else {
        const sorted=[...meals].sort((a,b)=>MEAL_ORDER.indexOf(a.mealType)-MEAL_ORDER.indexOf(b.mealType));
        const slotH=Math.min((gridH-DAY_HDR_H)/Math.max(sorted.length,1),38);
        sorted.forEach((meal,mi) => {
          const meta=MEAL_META[meal.mealType]??MEAL_META.dinner;
          const sy=TOP+DAY_HDR_H+mi*slotH;
          doc.setFillColor(...meta.bg); doc.rect(x+1,sy+1,dayW-4,slotH-2,'F');
          doc.setFillColor(...meta.color); doc.rect(x+1,sy+1,3,slotH-2,'F');
          doc.setFont('helvetica','bold'); doc.setFontSize(6); doc.setTextColor(...meta.color);
          doc.text(formatTextForPDF(meta.label,language).toUpperCase(),x+7,sy+6);
          doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...DARK);
          const lines=doc.splitTextToSize(formatTextForPDF(meal.dish.title,language),dayW-10);
          lines.slice(0,slotH>22?2:1).forEach((l:string,li:number)=>doc.text(l,x+7,sy+12+li*6));
          if (slotH>22) {
            doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(...GRAY_TXT);
            doc.text(`${meal.servings}p · ${meal.dish.cookingTime}min`,x+7,sy+slotH-4);
          }
          if (mi<sorted.length-1) {
            doc.setDrawColor(...BORDER); doc.setLineWidth(0.2);
            doc.line(x+2,sy+slotH,x+dayW-4,sy+slotH);
          }
        });
      }
    });

    doc.setDrawColor(...BORDER); doc.setLineWidth(0.3);
    doc.line(M,pageH-6,pageW-M,pageH-6);
    doc.setFont('helvetica','italic'); doc.setFontSize(6.5); doc.setTextColor(...GRAY_TXT);
    doc.text(`KingMenu — ${translations.tagline || 'Plan. Cook. Enjoy.'}`,pageW/2,pageH-2,{align:'center'});
  };

  weeks.forEach((wd,wi) => { if(wi>0) doc.addPage(); drawWeek(wd); });
  doc.save(`${translations.mealPlanFilename || 'meal-plan'}-${startDate}-${endDate}.pdf`);
};
