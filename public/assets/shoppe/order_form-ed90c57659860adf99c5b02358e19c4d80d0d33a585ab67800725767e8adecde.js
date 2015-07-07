(function() {
  $(function() {
    var refreshOrderDetails, setupForOrderForm, toggleDeliveryFieldsetForOrder;
    toggleDeliveryFieldsetForOrder = function() {
      var fieldset;
      fieldset = $('form.orderForm fieldset.delivery');
      if ($('form.orderForm input#order_separate_delivery_address').prop('checked')) {
        return fieldset.show();
      } else {
        return fieldset.hide();
      }
    };
    setupForOrderForm = function(form) {
      $('select', form).chosen({
        allow_single_deselect: true
      });
      $('select, table.orderItems input', form).on('change', function() {
        return refreshOrderDetails($(this).parents('form'), $(this).attr('id'));
      });
      return $('input#order_separate_delivery_address', form).on('change', toggleDeliveryFieldsetForOrder);
    };
    if ($('form.orderForm').length) {
      setupForOrderForm($('form.orderForm'));
      toggleDeliveryFieldsetForOrder();
    }
    return refreshOrderDetails = function(form, invokeField) {
      $('input', form).prop('readonly', true).addClass('disabled');
      return $.ajax({
        url: form.attr('action'),
        method: $('input[name=_method]', form).length ? $('input[name=_method]', form).val() : form.attr('method'),
        data: form.serialize(),
        dataType: 'html',
        success: function(html) {
          var focusedField;
          focusedField = $(':focus', form).attr('id');
          if (focusedField == null) {
            focusedField = invokeField;
          }
          console.log(focusedField);
          form.html($(html).find('form'));
          toggleDeliveryFieldsetForOrder();
          setupForOrderForm(form);
          $('div.moneyInput input', form).each(formatMoneyField);
          if (focusedField != null) {
            return $("#" + focusedField).focus().trigger("chosen:activate");
          }
        }
      });
    };
  });

}).call(this);
