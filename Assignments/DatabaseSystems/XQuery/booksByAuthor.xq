<booksByAuthor>{
  for $author in /bib/book/author
  group by $last := $author/last, $first := $author/first
  let $books := /bib/book[author[last = $last and first = $first]]
  order by $last, $first
  return
  <author>
    <last>{ $last }</last>
    <first>{ $first }</first>
    <numberOfBooks>{ count($books) }</numberOfBooks>
  </author>
}</booksByAuthor>