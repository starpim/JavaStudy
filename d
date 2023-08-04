package Maple;

public class Fighter extends Human {

 
		
		Fighter(String user,String sx,int hp, int mp, int dex, int luc, int nt){
			super(user,sx,hp,mp,dex,luc,nt);
			 
		}
	 
		void Power(){
			System.out.println(this.user+"은(는) 파워슬래시를 사용했다.");
}
		 
}
 
