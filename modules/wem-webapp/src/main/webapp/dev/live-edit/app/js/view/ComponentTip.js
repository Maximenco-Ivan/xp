/**
 * TODO: As ComponentTip has changed look'n feel this object may be obsolete and we may use ToolTip instead.
 */
(function ($) {
    'use strict';

    // Class definition (constructor function)
    var componentTip = AdminLiveEdit.view.ComponentTip = function () {
        this.create();
        this.bindEvents();
    };

    // Inherits ui.Base
    componentTip.prototype = new AdminLiveEdit.view.Base();

    // Fix constructor as it now is Base
    componentTip.constructor = componentTip;

    // Shorthand ref to the prototype
    var p = componentTip.prototype;

    // Uses
    var util = AdminLiveEdit.Util;


    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    p.$selectedComponent = null;

    p.bindEvents = function () {
        $(window).on('component:select', $.proxy(this.show, this));
        $(window).on('component:deselect', $.proxy(this.hide, this));
    };


    p.create = function () {
        var self = this;

        var html = '<div class="live-edit-component-tip" style="top:-5000px; left:-5000px;">' +
                   '    <span class="live-edit-component-tip-drag-handle"> </span> ' +
                   '    <span class="live-edit-component-tip-type-text"></span> ' +
                   '    <span class="live-edit-component-tip-name-text"></span>' +
                   '</div>';

        self.createElement(html);
        self.appendTo($('body'));

        // Make sure component is not deselected when the conponentTip element is clicked.
        self.getEl().on('click', function (event) {
            event.stopPropagation();
        });

        var $dragHandle = self.getDragHandle();

        $dragHandle.on('mousedown', function () {
            this.le_mouseIsDown = true;
            // TODO: Use PubSub
            AdminLiveEdit.DragDrop.enable();
        });

        $dragHandle.on('mousemove', function (event) {
            if (this.le_mouseIsDown) {

                this.le_mouseIsDown = false;
                // self.componentMenu.fadeOutAndHide();
                // TODO: Get the selected using PubSub
                var $selectedComponent = self.$selectedComponent;

                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent('mousedown', true, true, window, 0, event.screenX, event.screenY, event.clientX, event.clientY, false,
                    false, false, false, 0, null);

                $selectedComponent[0].dispatchEvent(evt);

            }
        });
        $dragHandle.on('mouseup', function () {
            this.le_mouseIsDown = false;
            // TODO: remove reference to DragDrop, use PubSub.
            AdminLiveEdit.DragDrop.disable();
        });



    };


    p.show = function (event, $component) {
        var self = this;

        self.$selectedComponent = $component;

        var componentInfo = util.getComponentInfo($component);

        self.showHideDragHandle(componentInfo);

        // Set text first so width is calculated correctly.
        self.setText(componentInfo.type, componentInfo.name);

        var componentBox = util.getBoxModel($component),
            leftPos = componentBox.left + (componentBox.width / 2 - self.getEl().outerWidth() / 2),
            topPos = componentBox.top - (self.getEl().height() * 2) - 2; // -2 to show above the highlighter border

        if (componentInfo.type === 'page' && componentInfo.tagName === 'body') {
            topPos = 0;
        }

        self.setCssPosition($component);
        self.getEl().css({
            top: topPos,
            left: leftPos
        });
    };


    p.showHideDragHandle = function (componentInfo) {
        var self = this;
        var $dragHandle = self.getDragHandle();
        if (componentInfo.type === 'window') {
            $dragHandle.css({'display': 'inline-block'});
        } else {
            $dragHandle.css({'display': 'none'});
        }
    };


    p.getDragHandle = function () {
        return this.getEl().find('.live-edit-component-tip-drag-handle');
    };


    p.setText = function (componentType, componentName) {
        var $componentTip = this.getEl();
        var typeText = componentType.concat(':');
        $componentTip.children('.live-edit-component-tip-type-text').text(typeText);
        $componentTip.children('.live-edit-component-tip-name-text').text(componentName);
    };


    p.hide = function () {
        this.$selectedComponent = null;

        this.getEl().css({
            top: '-5000px',
            left: '-5000px'
        });
    };

}($liveedit));