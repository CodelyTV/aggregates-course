git log --pretty=format: --name-only |
  awk 'BEGIN { RS = "" } { for (i = 1; i <= NF; i++) for (j = i + 1; j <= NF; j++) print $i " <-> " $j }' |
  sort |
  uniq -c |
  sort -rn |
  grep "3-all_in_domain_services" |
  sed 's/02-define_aggregates\/2-domain_services_vs_aggregates\/3-all_in_domain_services\///g' |
  head -n 5
