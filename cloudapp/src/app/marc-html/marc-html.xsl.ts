export const marcHtmlXsl = `
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="4.01" indent="yes"/>
<xsl:template match="/">
  <table>
  <xsl:for-each select="/record/controlfield">
    <tr>
      <th><xsl:value-of select="@tag" /></th>
      <td></td>
      <td><xsl:value-of select="." /></td>
    </tr>
  </xsl:for-each>
  <xsl:for-each select="/record/datafield">
    <tr>
      <th><xsl:value-of select="@tag" /></th>
      <td><xsl:value-of select="@ind1" /><xsl:text> </xsl:text><xsl:value-of select="@ind2" /> </td>
      <td>
        <xsl:for-each select="subfield">
          <strong>$$<xsl:value-of select="@code"/></strong><xsl:text> </xsl:text><xsl:value-of select="." /><xsl:text> </xsl:text>
        </xsl:for-each>
      </td>
    </tr>
  </xsl:for-each>  
  </table>
</xsl:template>
</xsl:stylesheet>
`