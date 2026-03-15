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
  const HEADER_H = 42;

  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, HEADER_H, "F");
  doc.setFillColor(...COLOR_ACCENT);
  doc.rect(0, HEADER_H - 3, pageWidth, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleX = isRTL ? pageWidth - MARGIN : MARGIN;
  const titleAlign = isRTL ? "right" : "left";
  doc.text(formatTextForPDF(title, language), titleX, 18, { align: titleAlign });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(210, 200, 255);
  const dateStr = new Date().toLocaleDateString();
  const subtitle = formatTextForPDF(
    `${translations.generatedOn}: ${dateStr}   •   ${translations.totalItems}: ${items.length}`,
    language
  );
  doc.text(subtitle, titleX, 30, { align: titleAlign });

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

// Optimized meal calendar PDF generation with compact layout and dot bullet points
export const generateMealCalendarPDF = (
  startDate: string,
  endDate: string,
  mealsByDate: Record<string, MealPlan[]>,
  language: string,
  translations: {
    title: string;
    dateRange: string;
    generatedOn: string;
    totalMeals: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    servings: string;
    cookingTime: string;
    noMeals: string;
  }
) => {
  const doc = new jsPDF();
  const isRTL = isRTLLanguage(language);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let yPosition = 25;
  
  // Compact title - "Meal Calendar"
  doc.setFontSize(18);
  const formattedTitle = formatTextForPDF("Meal Calendar", language);
  if (isRTL) {
    doc.text(formattedTitle, pageWidth - 20, yPosition, { align: 'right' });
  } else {
    doc.text(formattedTitle, 20, yPosition);
  }
  
  yPosition += 15;
  
  // Compact metadata in single line
  doc.setFontSize(10);
  const dateRangeText = formatTextForPDF(
    `${translations.dateRange}: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()} | ${translations.generatedOn}: ${new Date().toLocaleDateString()}`,
    language
  );
  
  if (isRTL) {
    doc.text(dateRangeText, pageWidth - 20, yPosition, { align: 'right' });
  } else {
    doc.text(dateRangeText, 20, yPosition);
  }
  
  yPosition += 20;
  
  // Generate date range
  const generateDateRange = () => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    
    return dates;
  };
  
  const dateRange = generateDateRange();
  
  // Meal type text for PDF (using dots instead of emojis)
  const getMealTypeText = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return `• ${translations.breakfast}`;
      case 'lunch': return `• ${translations.lunch}`;
      case 'dinner': return `• ${translations.dinner}`;
      case 'snack': return `• ${translations.snack}`;
      default: return `• ${mealType}`;
    }
  };
  
  // Group dates by week for more compact layout
  const groupDatesByWeek = (dates: Date[]) => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    dates.forEach((date: Date, index: number) => {
      currentWeek.push(date);
      
      // If it's Sunday (0) or the last date, start a new week
      if (date.getDay() === 0 || index === dates.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  };
  
  const weeks = groupDatesByWeek(dateRange);
  
  // Process each week
  weeks.forEach((week, weekIndex) => {
    // Check if we need a new page for this week
    const estimatedWeekHeight = week.length * 25; // Rough estimate
    if (yPosition + estimatedWeekHeight > pageHeight - 30) {
      doc.addPage();
      yPosition = 25;
    }
    
    // Week separator (except for first week)
    if (weekIndex > 0) {
      yPosition += 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
    }
    
    // Process each date in the week
    week.forEach(date => {
      const dateString = date.toISOString().split('T')[0];
      const dayMeals = mealsByDate[dateString] || [];
      
      // Check if we need a new page for this day
      const estimatedDayHeight = Math.max(20, dayMeals.length * 8 + 15);
      if (yPosition + estimatedDayHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 25;
      }
      
      // Compact date header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const dateHeader = formatTextForPDF(
        date.toLocaleDateString(language, {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        language
      );
      
      if (isRTL) {
        doc.text(dateHeader, pageWidth - 20, yPosition, { align: 'right' });
      } else {
        doc.text(dateHeader, 20, yPosition);
      }
      
      yPosition += 12;
      
      // Meals for this date in compact format
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      if (dayMeals.length > 0) {
        // Group meals by type for more compact display
        const mealsByType = dayMeals.reduce((acc, meal) => {
          if (!acc[meal.mealType]) acc[meal.mealType] = [];
          acc[meal.mealType].push(meal);
          return acc;
        }, {} as Record<string, MealPlan[]>);
        
        Object.entries(mealsByType).forEach(([_mealType, meals]) => {
          if (yPosition > pageHeight - 15) {
            doc.addPage();
            yPosition = 25;
          }
          
          meals.forEach(meal => {
            const mealText = formatTextForPDF(
              `  ${getMealTypeText(meal.mealType)}: ${meal.dish.title} (${meal.servings}p, ${meal.dish.cookingTime}m)`,
              language
            );
            
            // Split long text if needed
            const maxWidth = pageWidth - 50;
            const lines = doc.splitTextToSize(mealText, maxWidth);
            
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - 15) {
                doc.addPage();
                yPosition = 25;
              }
              
              if (isRTL) {
                doc.text(line, pageWidth - 25, yPosition, { align: 'right' });
              } else {
                doc.text(line, 25, yPosition);
              }
              
              yPosition += 8;
            });
            
            // Add notes if present (very compact)
            if (meal.notes) {
              const notesText = formatTextForPDF(`    Note: ${meal.notes}`, language);
              const noteLines = doc.splitTextToSize(notesText, maxWidth - 20);
              
              noteLines.forEach((line: string) => {
                if (yPosition > pageHeight - 15) {
                  doc.addPage();
                  yPosition = 25;
                }
                
                doc.setFontSize(8);
                if (isRTL) {
                  doc.text(line, pageWidth - 30, yPosition, { align: 'right' });
                } else {
                  doc.text(line, 30, yPosition);
                }
                yPosition += 7;
                doc.setFontSize(9);
              });
            }
          });
        });
      } else {
        const noMealsText = formatTextForPDF(`  ${translations.noMeals}`, language);
        if (isRTL) {
          doc.text(noMealsText, pageWidth - 25, yPosition, { align: 'right' });
        } else {
          doc.text(noMealsText, 25, yPosition);
        }
        yPosition += 8;
      }
      
      yPosition += 5; // Small space between days
    });
  });
  
  // Generate filename
  const filename = `meal-calendar-${startDate}-to-${endDate}.pdf`;
  doc.save(filename);
};
