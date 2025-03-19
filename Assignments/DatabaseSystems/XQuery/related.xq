
for $author in /bib/book/author
group by $last := $author/last, $first := $author/first
let $books := /bib/book[author[last = $last and first = $first]]
order by $last, $first
let $publishers := distinct-values(/bib/book[author[last = $last and first = $first]]/publisher)
where count($publishers) > 1 
return
<related>
  <last>{ $last }</last>
  <first>{ $first }</first>
  {
    for $pub in $publishers
    return
    <publisher>{ $pub }</publisher> 
  }
</related>
