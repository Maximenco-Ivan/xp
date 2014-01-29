module api.content.page.layout {

    export class LayoutTemplateSummary extends api.content.page.TemplateSummary<LayoutTemplateKey,LayoutTemplateName> {

        constructor(builder: LayoutTemplateSummaryBuilder) {
            super(builder);
        }
    }

    export class LayoutTemplateSummaryBuilder extends api.content.page.TemplateSummaryBuilder<LayoutTemplateKey,LayoutTemplateName> {

        public build(): LayoutTemplateSummary {
            return new LayoutTemplateSummary(this);
        }

        static fromJson(json: api.content.page.layout.json.LayoutTemplateSummaryJson): LayoutTemplateSummaryBuilder {
            var builder = new LayoutTemplateSummaryBuilder();
            builder.setKey(LayoutTemplateKey.fromString(json.key));
            builder.setDisplayName(json.displayName);
            builder.setDescriptorKey(DescriptorKey.fromString(json.descriptorKey));
            return builder;
        }
    }
}