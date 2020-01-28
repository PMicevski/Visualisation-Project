######### READING DATA
library(readr)

dv2Key_World_2018_2 <-read_csv("co2_combustion_71_16.csv")

######### EXPLORING DATA

### CONVERTING DF TO NUMERIC 

co2df_num <-as.data.frame(sapply(dv2Key_World_2018_2, as.numeric)) 

library(ggplot2)
ggplot(co2df_num, aes(X2,X13)) + 
  geom_point(size = 5, aes(color = X3)) + 
  scale_color_gradient(low = "white", high = "red") +
  geom_text(aes(label=rownames(co2df_num))) + 
  coord_cartesian(xlim = c(0,1500), ylim = c(0,16000))

library(ggplot2)
ggplot(co2df_num, aes(X3,X15)) + 
  geom_point(size = 5, aes(color = X15)) + 
  scale_color_gradient(low = "white", high = "red") +
  geom_text(aes(label=rownames(co2df_num))) +
  coord_cartesian(xlim = c(0,1000), ylim = c(0,5))


#### RENAMED DF ROW NAME AFTER BEING CHANGED TO NUMERIC
rownames(co2df_num) <-make.names(co2emdf$`Selected indicators for 2016`, unique = T) 

co2df_num <-co2df_num[,-c(1)]

saveRDS(co2df_num, file = "co2.rds")

co2df_num <-readRDS(file = "co2.rds")

library(plyr)

### RENAMED ROW NAME
co2emdf <-rename(co2emdf, c("Selected indicators for 2016"="Country")) 



########### D3 DATA TIDY WIDE TO LONG 
library(readr)
library(tidyr)

Em_Fuel_Comb_Y <-read_csv("WORLD_FUEL_COMBUSTION_SECTOR_2016_fix.csv")
Em_Fuel_Comb_Y <-gather(Em_Fuel_Comb_Y, 
                        `Electricity/Heat production`, 
                        `Other energy ind`, 
                        `Manufacturing/construction`,
                        `Transport`, 
                        `of which: road`, 
                        `Residential`, 
                        `Commercial/public services`, key=sector, value = "value")

Em_Fuel_Comb_Y <-gather(dv2Key_World_2018_2, `1971`, 
                        `1975`, `1980`, `1985`, `1990`, 
                        `1995`, `2000`, `2005`,`2010`, 
                        `2015`, `2016`, key=`year`, value = "value")

Em_Fuel_Comb_Y[3]

for(i in 3:length(Em_Fuel_Comb_Y)){
  #print(i)
  Em_Fuel_Comb_Y[[i]] <-gsub(" ","",Em_Fuel_Comb_Y[[i]]) # working
  }

write_csv(Em_Fuel_Comb_Y, "WORLD_FUEL_COMBUSTION_SECTOR_2016_fix.csv")

