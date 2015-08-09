
Add SSL certificate (check with arturs about pricing)

Change logo 

Work Coveralls/Overalss fix the colors

Clearance - Try to group them, put reduced price only on clearance remove from everywhere else


apuniforms@gmail.com

take out the tax


<% if @product.product_category_id == 22 %>
<table class="ui celled structured table">
<thead>
<tr>
  <th rowspan="2">Color</th>
  <th colspan="9">Available Sizes</th>
</tr>
</thead>
<tbody>
<% @colors_array.each do |color| %>
<tr>
  <td><%= color %></td>

<% @clearance_sizes.each do |clear_sizes| %>
 <% @clear_sizes = clear_sizes.split(",") %>
 <% @clear_sizes.each do |cs| %>

  <td colspan="1"><%= cs %></td>
</tr>

<% end %>
<% end %>
<% end %>
</tbody>
</table><br>
<% end %>








