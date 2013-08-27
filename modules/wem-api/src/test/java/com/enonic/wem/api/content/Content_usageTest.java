package com.enonic.wem.api.content;


import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateMidnight;
import org.joda.time.DateTime;
import org.junit.Test;

import com.enonic.wem.api.data.ContentData;
import com.enonic.wem.api.data.Data;
import com.enonic.wem.api.data.DataSet;
import com.enonic.wem.api.data.Property;
import com.enonic.wem.api.data.Value;
import com.enonic.wem.api.data.type.ValueType;
import com.enonic.wem.api.data.type.ValueTypes;

import static com.enonic.wem.api.data.DataSet.newDataSet;
import static com.enonic.wem.api.data.Property.Date.newDate;
import static com.enonic.wem.api.data.Property.DecimalNumber.newDecimalNumber;
import static com.enonic.wem.api.data.Property.HtmlPart.newHtmlPart;
import static com.enonic.wem.api.data.Property.Text.newText;
import static com.enonic.wem.api.data.Property.WholeNumber.newWholeNumber;
import static com.enonic.wem.api.data.Property.newProperty;
import static com.enonic.wem.api.data.type.ValueTypes.DATE_MIDNIGHT;
import static com.enonic.wem.api.data.type.ValueTypes.DECIMAL_NUMBER;
import static com.enonic.wem.api.data.type.ValueTypes.HTML_PART;
import static com.enonic.wem.api.data.type.ValueTypes.TEXT;
import static com.enonic.wem.api.data.type.ValueTypes.WHOLE_NUMBER;
import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertFalse;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertTrue;

public class Content_usageTest
{
    @Test
    public void dataSet_setProperty()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.setProperty( "myText", new Value.Text( "abc" ) );
        dataSet.setProperty( "myNum", new Value.WholeNumber( 123 ) );
        dataSet.setProperty( "myDate", new Value.Date( new DateMidnight( 2013, 1, 13 ) ) );
        dataSet.setProperty( "myDec", new Value.DecimalNumber( 123.123 ) );
        dataSet.setProperty( "myHtml", new Value.HtmlPart( "<p>abc</p>" ) );

        // verify
        assertEquals( TEXT, dataSet.getProperty( "myText" ).getValueType() );
        assertEquals( WHOLE_NUMBER, dataSet.getProperty( "myNum" ).getValueType() );
        assertEquals( DATE_MIDNIGHT, dataSet.getProperty( "myDate" ).getValueType() );
        assertEquals( DECIMAL_NUMBER, dataSet.getProperty( "myDec" ).getValueType() );
        assertEquals( HTML_PART, dataSet.getProperty( "myHtml" ).getValueType() );
    }

    @Test
    public void dataSet_setProperty_with_array_of_Values()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.setProperty( "myText", new Value.Text( "aaa" ), new Value.Text( "bbb" ), new Value.Text( "ccc" ) );

        // verify
        assertEquals( "aaa", dataSet.getProperty( "myText" ).getString( 0 ) );
        assertEquals( "bbb", dataSet.getProperty( "myText" ).getString( 1 ) );
        assertEquals( "ccc", dataSet.getProperty( "myText" ).getString( 2 ) );
    }

    @Test
    public void dataSet_setProperty_with_DataPath_containing_DataSet()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.setProperty( "mySet.myText", new Value.Text( "abc" ) );
        dataSet.setProperty( "mySet.myNum", new Value.WholeNumber( 123 ) );
        dataSet.setProperty( "mySet.myDate", new Value.Date( new DateMidnight( 2013, 1, 13 ) ) );
        dataSet.setProperty( "mySet.myDec", new Value.DecimalNumber( 123.123 ) );
        dataSet.setProperty( "mySet.myHtml", new Value.HtmlPart( "<p>abc</p>" ) );

        // verify
        assertEquals( "mySet.myText", dataSet.getProperty( "mySet.myText" ).getPath().toString() );
        assertEquals( "mySet.myNum", dataSet.getProperty( "mySet.myNum" ).getPath().toString() );
        assertEquals( "mySet.myDate", dataSet.getProperty( "mySet.myDate" ).getPath().toString() );
        assertEquals( "mySet.myDec", dataSet.getProperty( "mySet.myDec" ).getPath().toString() );
        assertEquals( "mySet.myHtml", dataSet.getProperty( "mySet.myHtml" ).getPath().toString() );
    }

    @Test
    public void dataSet_add_Data_using_newProperty()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.add( newProperty( "myText" ).type( TEXT ).value( "abc" ).build() );
        dataSet.add( newProperty( "myNum" ).type( WHOLE_NUMBER ).value( 123L ).build() );
        dataSet.add( newProperty( "myDec" ).type( DECIMAL_NUMBER ).value( 123.123 ).build() );
        dataSet.add( newProperty( "myDate" ).type( DATE_MIDNIGHT ).value( new DateMidnight( 2013, 1, 13 ) ).build() );
        dataSet.add( newProperty( "myHtml" ).type( HTML_PART ).value( "<p>abc</p>" ).build() );

        // verify
        assertEquals( TEXT, dataSet.getProperty( "myText" ).getValueType() );
        assertEquals( WHOLE_NUMBER, dataSet.getProperty( "myNum" ).getValueType() );
        assertEquals( DATE_MIDNIGHT, dataSet.getProperty( "myDate" ).getValueType() );
        assertEquals( DECIMAL_NUMBER, dataSet.getProperty( "myDec" ).getValueType() );
        assertEquals( HTML_PART, dataSet.getProperty( "myHtml" ).getValueType() );

        assertFalse( dataSet.getProperty( "myText" ) instanceof Property.Text );
        assertFalse( dataSet.getProperty( "myNum" ) instanceof Property.WholeNumber );
        assertFalse( dataSet.getProperty( "myDec" ) instanceof Property.DecimalNumber );
        assertFalse( dataSet.getProperty( "myDate" ) instanceof Property.Date );
        assertFalse( dataSet.getProperty( "myHtml" ) instanceof Property.HtmlPart );
    }

    @Test
    public void dataSet_add_Data_using_newPropertyType()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.add( newText( "myText" ).value( "abc" ) );
        dataSet.add( newWholeNumber( "myNum" ).value( 123L ) );
        dataSet.add( newDecimalNumber( "myDec" ).value( 123.123 ) );
        dataSet.add( newDate( "myDate" ).value( new DateMidnight( 2013, 1, 13 ) ) );
        dataSet.add( newHtmlPart( "myHtml" ).value( "<p>abc</p>" ) );

        // verify
        assertEquals( TEXT, dataSet.getProperty( "myText" ).getValueType() );
        assertEquals( WHOLE_NUMBER, dataSet.getProperty( "myNum" ).getValueType() );
        assertEquals( DATE_MIDNIGHT, dataSet.getProperty( "myDate" ).getValueType() );
        assertEquals( DECIMAL_NUMBER, dataSet.getProperty( "myDec" ).getValueType() );
        assertEquals( HTML_PART, dataSet.getProperty( "myHtml" ).getValueType() );

        assertTrue( dataSet.getProperty( "myText" ) instanceof Property.Text );
        assertTrue( dataSet.getProperty( "myNum" ) instanceof Property.WholeNumber );
        assertTrue( dataSet.getProperty( "myDec" ) instanceof Property.DecimalNumber );
        assertTrue( dataSet.getProperty( "myDate" ) instanceof Property.Date );
        assertTrue( dataSet.getProperty( "myHtml" ) instanceof Property.HtmlPart );
    }

    @Test
    public void dataSet_add_Data_using_new_PropertyType()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.add( new Property.Text( "myText", "abc" ) );
        dataSet.add( new Property.WholeNumber( "myNum", 123L ) );
        dataSet.add( new Property.DecimalNumber( "myDec", 123.123 ) );
        dataSet.add( new Property.Date( "myDate", new DateMidnight( 2013, 1, 13 ) ) );
        dataSet.add( new Property.HtmlPart( "myHtml", "<p>abc</p>" ) );

        // verify
        assertEquals( TEXT, dataSet.getProperty( "myText" ).getValueType() );
        assertEquals( WHOLE_NUMBER, dataSet.getProperty( "myNum" ).getValueType() );
        assertEquals( DATE_MIDNIGHT, dataSet.getProperty( "myDate" ).getValueType() );
        assertEquals( DECIMAL_NUMBER, dataSet.getProperty( "myDec" ).getValueType() );
        assertEquals( HTML_PART, dataSet.getProperty( "myHtml" ).getValueType() );

        assertTrue( dataSet.getProperty( "myText" ) instanceof Property.Text );
        assertTrue( dataSet.getProperty( "myNum" ) instanceof Property.WholeNumber );
        assertTrue( dataSet.getProperty( "myDec" ) instanceof Property.DecimalNumber );
        assertTrue( dataSet.getProperty( "myDate" ) instanceof Property.Date );
        assertTrue( dataSet.getProperty( "myHtml" ) instanceof Property.HtmlPart );
    }

    @Test
    public void dataSet_addProperty()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.addProperty( "myText", new Value.Text( "abc" ) );
        dataSet.addProperty( "myNum", new Value.WholeNumber( 123 ) );
        dataSet.addProperty( "myDec", new Value.DecimalNumber( 123.123 ) );
        dataSet.addProperty( "myDate", new Value.Date( new DateMidnight( 2013, 1, 13 ) ) );
        dataSet.addProperty( "myHtml", new Value.HtmlPart( "<p>abc</p>" ) );

        // verify
        assertEquals( TEXT, dataSet.getProperty( "myText" ).getValueType() );
        assertEquals( WHOLE_NUMBER, dataSet.getProperty( "myNum" ).getValueType() );
        assertEquals( DATE_MIDNIGHT, dataSet.getProperty( "myDate" ).getValueType() );
        assertEquals( DECIMAL_NUMBER, dataSet.getProperty( "myDec" ).getValueType() );
        assertEquals( HTML_PART, dataSet.getProperty( "myHtml" ).getValueType() );

        assertTrue( dataSet.getProperty( "myText" ) instanceof Property.Text );
        assertTrue( dataSet.getProperty( "myNum" ) instanceof Property.WholeNumber );
        assertTrue( dataSet.getProperty( "myDec" ) instanceof Property.DecimalNumber );
        assertTrue( dataSet.getProperty( "myDate" ) instanceof Property.Date );
        assertTrue( dataSet.getProperty( "myHtml" ) instanceof Property.HtmlPart );
    }

    @Test
    public void dataSet_addProperty_with_DataPath_containing_DataSet()
    {
        ContentData contentData = new ContentData();

        // exercise
        contentData.addProperty( "mySet.myText", new Value.Text( "abc" ) );
        contentData.addProperty( "mySet.myNum", new Value.WholeNumber( 123 ) );
        contentData.addProperty( "mySet.myDec", new Value.DecimalNumber( 123.123 ) );
        contentData.addProperty( "mySet.myDate", new Value.Date( new DateMidnight( 2013, 1, 13 ) ) );
        contentData.addProperty( "mySet.myHtml", new Value.HtmlPart( "<p>abc</p>" ) );

        // verify
        assertEquals( "mySet.myText", contentData.getProperty( "mySet.myText" ).getPath().toString() );
        assertEquals( "mySet.myNum", contentData.getProperty( "mySet.myNum" ).getPath().toString() );
        assertEquals( "mySet.myDate", contentData.getProperty( "mySet.myDate" ).getPath().toString() );
        assertEquals( "mySet.myDec", contentData.getProperty( "mySet.myDec" ).getPath().toString() );
        assertEquals( "mySet.myHtml", contentData.getProperty( "mySet.myHtml" ).getPath().toString() );
    }

    @Test
    public void dataSet_add_DataSet()
    {
        DataSet contentData = new ContentData();

        // exercise
        contentData.add( newDataSet().name( "mySet" ).build() );

        // verify
        assertNotNull( contentData.getDataSet( "mySet" ) );
    }

    @Test
    public void data_getValue()
    {
        DataSet dataSet = new ContentData();
        dataSet.add( newProperty( "myText" ).type( TEXT ).value( "abc" ).build() );
        dataSet.add( newProperty( "myNum" ).type( WHOLE_NUMBER ).value( 123L ).build() );
        dataSet.add( newProperty( "myDec" ).type( DECIMAL_NUMBER ).value( 123.123 ).build() );
        dataSet.add( newProperty( "myDate" ).type( DATE_MIDNIGHT ).value( new DateMidnight( 2013, 1, 13 ) ).build() );
        dataSet.add( newProperty( "myHtml" ).type( HTML_PART ).value( "<p>abc</p>" ).build() );

        // exercise & verify
        assertEquals( "abc", dataSet.getProperty( "myText" ).getString() );
        assertEquals( new Long( 123L ), dataSet.getProperty( "myNum" ).getLong() );
        assertEquals( 123.123, dataSet.getProperty( "myDec" ).getDouble() );
        assertEquals( new DateMidnight( 2013, 1, 13 ), dataSet.getProperty( "myDate" ).getDate() );
        assertEquals( "<p>abc</p>", dataSet.getProperty( "myHtml" ).getString() );
    }

    @Test
    public void dataSet_add_Data_array()
    {
        DataSet dataSet = new ContentData();

        // exercise
        dataSet.add( newProperty( "myText" ).type( TEXT ).value( "a" ).build() );
        dataSet.add( newProperty( "myText" ).type( TEXT ).value( "b" ).build() );
        dataSet.add( newProperty( "myText" ).type( TEXT ).value( "c" ).build() );

        // verify
        assertEquals( "a", dataSet.getProperty( "myText" ).getString( 0 ) );
        assertEquals( "b", dataSet.getProperty( "myText" ).getString( 1 ) );
        assertEquals( "c", dataSet.getProperty( "myText" ).getString( 2 ) );
    }

    @Test
    public void invoice_newProperty()
    {
        Invoice invoice = new Invoice();
        invoice.invoiceDate = DateTime.now();
        invoice.recipient = "Runar Myklebust";
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 4mm", 120.00 ) );
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 10mm", 120.00 ) );

        ContentData contentData = new ContentData();
        contentData.add(
            newProperty( "invoiceDate" ).type( ValueTypes.DATE_MIDNIGHT ).value( invoice.invoiceDate.toDateMidnight() ).build() );
        contentData.add( newProperty( "recipient" ).type( ValueTypes.TEXT ).value( invoice.recipient ).build() );

        for ( InvoiceLine line : invoice.lines )
        {
            DataSet invoiceLine = DataSet.newDataSet().name( "invoiceLine" ).build();
            invoiceLine.add( newProperty( "text" ).type( ValueTypes.TEXT ).value( line.text ).build() );
            invoiceLine.add( newProperty( "money" ).type( resolveType( line.money ) ).value( line.money ).build() );

            contentData.add( invoiceLine );
        }

        // print out
        System.out.println( contentData.getProperty( "invoiceDate" ).getDate() );
        System.out.println( contentData.getProperty( "recipient" ).getString() );
        for ( Data invoiceLine : contentData.getDataSet( "invoiceLine" ).getArray() )
        {
            DataSet invoiceLineDS = invoiceLine.toDataSet();
            System.out.println( invoiceLineDS.getProperty( "text" ).getString() + ": " + invoiceLineDS.getProperty( "money" ).getString() );
        }
    }

    @Test
    public void invoice_newType()
    {
        Invoice invoice = new Invoice();
        invoice.invoiceDate = DateTime.now();
        invoice.recipient = "Runar Myklebust";
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 4mm", 120.00 ) );
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 10mm", 120.00 ) );

        ContentData contentData = new ContentData();
        contentData.add( newDate( "invoiceDate" ).value( invoice.invoiceDate.toDateMidnight() ) );
        contentData.add( newText( "recipient" ).value( invoice.recipient ) );

        for ( InvoiceLine line : invoice.lines )
        {
            DataSet invoiceLine = DataSet.newDataSet().name( "invoiceLine" ).build();
            invoiceLine.add( newText().name( "text" ).value( line.text ).build() );

            invoiceLine.add( newProperty( "money" ).type( resolveType( line.money ) ).value( line.money ).build() );
            invoiceLine.add( myNewProperty( "money", line.money ) );

            contentData.add( invoiceLine );
        }

        // print out
        System.out.println( contentData.getProperty( "invoiceDate" ).getDate() );
        System.out.println( contentData.getProperty( "recipient" ).getString() );
        for ( Data invoiceLine : contentData.getDataSet( "invoiceLine" ).getArray() )
        {
            DataSet invoiceLineDS = invoiceLine.toDataSet();
            System.out.println( invoiceLineDS.getProperty( "text" ).getString() + ": " + invoiceLineDS.getProperty( "money" ).getString() );
        }

    }

    @Test
    public void invoice_new_Type()
    {
        Invoice invoice = new Invoice();
        invoice.invoiceDate = DateTime.now();
        invoice.recipient = "Runar Myklebust";
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 4mm", 120.00 ) );
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 10mm", 120.00 ) );

        ContentData contentData = new ContentData();
        contentData.add( new Property.Date( "invoiceDate", invoice.invoiceDate.toDateMidnight() ) );
        contentData.add( new Property.Text( "recipient", invoice.recipient ) );

        for ( InvoiceLine line : invoice.lines )
        {
            DataSet invoiceLine = DataSet.newDataSet( "invoiceLine" ).build();
            invoiceLine.add( new Property.Text( "text", line.text ) );
            invoiceLine.add( myNewProperty( "money", line.money ) );
            contentData.add( invoiceLine );
        }

        // print out
        System.out.println( contentData.getProperty( "invoiceDate" ).getDate() );
        System.out.println( contentData.getProperty( "recipient" ).getString() );
        for ( Data invoiceLine : contentData.getDataSet( "invoiceLine" ).getArray() )
        {
            DataSet invoiceLineDS = invoiceLine.toDataSet();
            System.out.println( invoiceLineDS.getProperty( "text" ).getString() + ": " + invoiceLineDS.getProperty( "money" ).getString() );
        }

    }

    @Test
    public void invoice_setData_with_Value_Type()
    {
        Invoice invoice = new Invoice();
        invoice.invoiceDate = DateTime.now();
        invoice.recipient = "Runar Myklebust";
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 4mm", 120.00 ) );
        invoice.lines.add( new InvoiceLine( "1x1m Oak veneer, 10mm", 120.00 ) );

        ContentData contentData = new ContentData();
        contentData.setProperty( "invoiceDate", new Value.Date( invoice.invoiceDate.toDateMidnight() ) );
        contentData.setProperty( "recipient", new Value.Text( invoice.recipient ) );

        for ( InvoiceLine line : invoice.lines )
        {
            DataSet invoiceLine = new DataSet( "invoiceLine" );
            invoiceLine.setProperty( "text", new Value.Text( line.text ) );
            invoiceLine.setProperty( "money", myNewValue( line.money ) );
            contentData.add( invoiceLine );
        }

        // print out
        System.out.println( contentData.getProperty( "invoiceDate" ).getDate() );
        System.out.println( contentData.getProperty( "recipient" ).getString() );
        for ( Data invoiceLine : contentData.getDataSet( "invoiceLine" ).getArray() )
        {
            DataSet invoiceLineDS = invoiceLine.toDataSet();
            System.out.println( invoiceLineDS.getProperty( "text" ).getString() + ": " + invoiceLineDS.getProperty( "money" ).getString() );
        }

    }

    private ValueType resolveType( final Object value )
    {
        if ( value instanceof Double )
        {
            return ValueTypes.DECIMAL_NUMBER;
        }
        else
        {
            return null;
        }
    }

    private Data myNewProperty( final String text, final Object value )
    {
        if ( value instanceof Double )
        {
            return newDecimalNumber().name( text ).value( (Double) value ).build();
        }
        else
        {
            return null;
        }
    }

    private Value myNewValue( final Object value )
    {
        if ( value instanceof Double )
        {
            return new Value.DecimalNumber( ( (Double) value ) );
        }
        else
        {
            return null;
        }
    }


    private class Invoice
    {

        private DateTime invoiceDate;

        private String recipient;

        private List<InvoiceLine> lines = new ArrayList<>();

    }

    private class InvoiceLine
    {
        private String text;

        private Double money;

        private InvoiceLine( final String text, final Double money )
        {
            this.text = text;
            this.money = money;
        }
    }


}
