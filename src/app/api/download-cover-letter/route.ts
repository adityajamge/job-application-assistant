import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coverLetter, contactInfo, date, companyName, position, hiringManager } = body;

    // Create DOCX document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { 
              top: 1440,    // 1 inch
              right: 1440, 
              bottom: 1440, 
              left: 1440 
            }
          }
        },
        children: [
          // Header - Contact Info
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: contactInfo.name.toUpperCase(),
                bold: true,
                size: 28,
                font: "Arial"
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: contactInfo.location || "",
                size: 22,
                font: "Arial"
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: [contactInfo.email, contactInfo.phone].filter(Boolean).join(" | "),
                size: 22,
                font: "Arial"
              })
            ]
          }),
          ...(contactInfo.linkedin ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `LinkedIn: ${contactInfo.linkedin}`,
                  size: 22,
                  font: "Arial"
                })
              ]
            })
          ] : []),
          
          // Blank line
          new Paragraph({ text: "" }),
          
          // Date
          new Paragraph({
            children: [
              new TextRun({ 
                text: date, 
                size: 24,
                font: "Arial"
              })
            ]
          }),
          
          new Paragraph({ text: "" }),
          
          // Recipient
          new Paragraph({
            children: [
              new TextRun({ 
                text: hiringManager || "Hiring Manager", 
                size: 24,
                font: "Arial"
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ 
                text: companyName || "Hiring Company", 
                size: 24,
                font: "Arial"
              })
            ]
          }),
          
          new Paragraph({ text: "" }),
          
          // Cover letter body (already includes salutation)
          ...coverLetter.split('\n\n').map((para: string) => 
            new Paragraph({
              children: [
                new TextRun({ 
                  text: para.trim(), 
                  size: 24,
                  font: "Arial"
                })
              ],
              spacing: { after: 240 }
            })
          )
        ]
      }]
    });
    
    // Convert to buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Return as downloadable file
    const fileName = `${contactInfo.name.replace(/\s+/g, '_')}_Cover_Letter.docx`;
    
    return new Response(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
    
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
